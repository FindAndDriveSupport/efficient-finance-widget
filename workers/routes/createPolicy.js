/**
 * createPolicy.js — Step 3: Submit Application → Edith CreatePolicy
 * POST /api/policy/create
 *
 * Calls Edith webservice CreatePolicy with full field mapping.
 * Uses edithErrors.js error classification for user-facing messages.
 * Logs all errors to Cloudflare structured logging for CI/CD observability.
 */

import { STATUS_CODES, SYSTEM_MESSAGES, FIELD_ERRORS, parseEdithErrors } from '../utils/edithErrors.js';

// YONDA Service Fee — defaults applied for financeType === 'bike'
const YONDA_SERVICE_FEE = {
  productOptionId: '9845',
  price: '2990.00', // R2,990 including VAT
};

export async function handleCreatePolicy(request, ctx, jsonResponse) {
  const { env, dealerConfig, origin, ctx: workerCtx } = ctx;

  let body;
  try { body = await request.json(); }
  catch { return jsonResponse({ error: 'Invalid JSON body' }, 400, origin, env); }

  // Select Edith credentials and WSDL URL based on dealer's edithEnv
  const isProd = dealerConfig.edithEnv === 'prod';
  const companyCode = isProd ? env.EDITH_COMPANY_CODE_PROD : env.EDITH_COMPANY_CODE;
  const companyPass = isProd ? env.EDITH_COMPANY_PASS_PROD : env.EDITH_COMPANY_PASS;
  const wsdlUrl = isProd ? env.EDITH_WSDL_URL_PROD : env.EDITH_WSDL_URL;
  console.error('EDITH_WSDL_URL: ' + wsdlUrl + ' | isProd: ' + isProd);

  // Build Edith XML payload
  const salesRef = generateSalesRef(dealerConfig.branchCode);
  console.error("EDITH_PAYLOAD: " + JSON.stringify(body));
  const xml = buildEdithXML(body, companyCode, companyPass, dealerConfig, salesRef);
  console.error("EDITH_XML: " + xml);

  console.log(JSON.stringify({
    level: 'info',
    type: 'edith_create_policy_request',
    salesRef,
    dealerKey: dealerConfig.key,
    branchCode: dealerConfig.branchCode,
    edithEnv: dealerConfig.edithEnv || 'dev',
    ts: new Date().toISOString(),
  }));

  let edithResponse;
  try {
    const res = await fetch(wsdlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'http://ws.edith.co.za/EdithServices/PolicyServicesV300/CreatePolicy',
      },
      body: xml,
    });
    const text = await res.text();
    console.log(JSON.stringify({
      level: 'info',
      type: 'edith_create_policy_response',
      salesRef,
      status: res.status,
      body: text,
      ts: new Date().toISOString(),
    }));
    console.error("EDITH_RAW_RESPONSE: " + text);
    edithResponse = parseEdithXMLResponse(text);
    console.error("EDITH_PARSED: " + JSON.stringify(edithResponse));
  } catch (err) {
    logError('edith_network_error', err, env, { salesRef, dealerKey: dealerConfig.key });
    return jsonResponse({
      error: 'Could not connect to the finance system. Please try again.',
      code: 500,
    }, 502, origin, env);
  }

  // Handle system-level errors
  const sysCode = edithResponse.statusCode;
  if (SYSTEM_MESSAGES[sysCode]) {
    const msg = SYSTEM_MESSAGES[sysCode];
    logError('edith_system_error', { code: sysCode, internal: msg.internal }, env, { salesRef });
    return jsonResponse({
      error: msg.title,
      message: msg.message,
      action: msg.action,
      code: sysCode,
    }, 422, origin, env);
  }

  // Handle field-level errors
  if (edithResponse.errors && edithResponse.errors.length > 0) {
    const parsedErrors = parseEdithErrors(edithResponse.errors);
    const fatal = parsedErrors.filter(e => e.severity === 'error');
    const warnings = parsedErrors.filter(e => e.severity === 'warning');

    if (fatal.length > 0) {
      logError('edith_field_errors', fatal, env, { salesRef });
      return jsonResponse({
        success: false,
        errors: fatal,
        warnings,
        code: 300,
      }, 422, origin, env);
    }

    // Code 200 — success with warnings
    logWarning('edith_field_warnings', warnings, env, { salesRef });
    return jsonResponse({
      success: true,
      policyNumber: edithResponse.policyNumber,
      warnings,
      code: 200,
    }, 200, origin, env);
  }

  // Clean success — store policy event in D1 and return
  const policyNumber = edithResponse.policyNumber;

  // Write to D1 in background (non-blocking)
  if (env.DB && policyNumber && workerCtx) {
    workerCtx.waitUntil(
      env.DB.prepare(`
        INSERT INTO policy_events (dealer_key, policy_number, applicant_id, sales_ref, branch_code, finance_type)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind(
        dealerConfig.key,
        policyNumber,
        body.applicantId || null,
        salesRef,
        dealerConfig.branchCode,
        dealerConfig.financeType || 'vehicle',
      )
      .run()
      .catch(err => console.error('D1 write failed:', err.message))
    );
  }

  return jsonResponse({
    success: true,
    policyNumber,
    salesRef,
    code: 100,
  }, 200, origin, env);
}

// ── Edith XML Builder ─────────────────────────────────────────

function buildEdithXML(data, companyCode, companyPass, dealer, salesRef) {
  const d = data;
  const isBike = dealer.financeType === 'bike';

  // ── Bank Accounts block (Policy-level, before Client) — bike only ──
  const bankAccountsXml = (isBike && d.bankBranchCode) ? `
        <pol:BankAccounts>
          <pol:BankAccount>
            ${d.bankAccountNumber ? `<pol:AccountNumber>${esc(d.bankAccountNumber)}</pol:AccountNumber>` : ''}
            ${d.accountType      ? `<pol:AccountType>${esc(d.accountType.toUpperCase())}</pol:AccountType>` : ''}
            <pol:AccountHolderName>${esc((d.firstName || "") + " " + (d.lastName || ""))}</pol:AccountHolderName>
            <pol:BankBranchCode>${esc(d.bankBranchCode)}</pol:BankBranchCode>
            <pol:PrimaryAccountInd>-1</pol:PrimaryAccountInd>
          </pol:BankAccount>
        </pol:BankAccounts>` : '';

  // ── Products array (top-level, sibling of Policy) — YONDA service fee ──
  const productsXml = isBike ? `
      <pol:Products>
        <pol:Product>
          <pol:ProductOptionId>${YONDA_SERVICE_FEE.productOptionId}</pol:ProductOptionId>
          <pol:Price>${YONDA_SERVICE_FEE.price}</pol:Price>
          <pol:SalesReferenceNumber>${esc(salesRef)}</pol:SalesReferenceNumber>
        </pol:Product>
      </pol:Products>` : '';

  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://ws.edith.co.za/EdithServices/PolicyServicesV300">
  <soap:Body>
    <pol:CreatePolicy>
      <pol:Credentials>
        <pol:CompanyCode>${companyCode}</pol:CompanyCode>
        <pol:CompanyPassword>${companyPass}</pol:CompanyPassword>
      </pol:Credentials>
      <pol:Policy>
        <pol:BranchCode>${dealer.branchCode}</pol:BranchCode>
        <pol:SalesReferenceNumber>${salesRef}</pol:SalesReferenceNumber>
        <pol:TransactionType>${isBike ? 'MOTORBIKE SALE' : 'VEHICLE SALE'}</pol:TransactionType>
        <pol:Category>PRIVATE</pol:Category>${bankAccountsXml}
        ${d.vehicleMake    ? `<pol:Manufacturer>${esc(d.vehicleMake)}</pol:Manufacturer>` : ''}
        ${d.vehicleModel   ? `<pol:Model>${esc(d.vehicleModel)}</pol:Model>` : ''}
        ${d.vehicleMm      ? `<pol:VehicleCode>${esc(d.vehicleMm)}</pol:VehicleCode>` : ''}
        ${(d.vehicleMake || d.vehicleModel) ? `<pol:VehicleDescription>${esc([d.vehicleMake, d.vehicleModel].filter(Boolean).join(' '))}</pol:VehicleDescription>` : ''}
        ${d.estimatedApprovalAmount ? `<pol:RetailPrice>${d.estimatedApprovalAmount}</pol:RetailPrice>` : ''}
        <pol:NewUsed>USED</pol:NewUsed>
       <pol:Client>
          ${d.title         ? `<pol:Title>${esc(d.title.toUpperCase())}</pol:Title>` : ''}
          ${d.firstName     ? `<pol:FirstName>${esc(d.firstName)}</pol:FirstName>` : ''}
          <pol:LastName>${esc(d.lastName)}</pol:LastName>
          ${d.mobileNumber  ? `<pol:MobileNumber>${d.mobileNumber}</pol:MobileNumber>` : ''}
          ${d.emailAddress  ? `<pol:EmailAddress>${esc(d.emailAddress)}</pol:EmailAddress>` : ''}
          ${d.idNumber      ? `<pol:IDType>${esc(d.idType || 'RSA ID')}</pol:IDType><pol:IDNumber>${d.idNumber}</pol:IDNumber>` : '<pol:IDType>FOREIGN NATIONAL</pol:IDType>'}
          ${d.gender ? `<pol:Gender>${esc(d.gender.toUpperCase())}</pol:Gender>` : ''}
          ${d.maritalStatus ? `<pol:MaritalStatus>${esc(d.maritalStatus)}</pol:MaritalStatus>` : ''}
          ${d.address1 ? `
          <pol:PhysicalAddress>
            <pol:Address1>${esc(d.address1)}</pol:Address1>
            ${d.suburb   ? `<pol:Suburb>${esc(d.suburb)}</pol:Suburb>` : ''}
            ${d.city     ? `<pol:City>${esc(d.city)}</pol:City>` : ''}
            ${d.postCode ? `<pol:PostCode>${esc(d.postCode)}</pol:PostCode>` : ''}
            <pol:Country>SOUTH AFRICA</pol:Country>
          </pol:PhysicalAddress>
          ${d.residentialStatus    ? `<pol:ResidentialStatus>${esc(d.residentialStatus)}</pol:ResidentialStatus>` : ''}
          ${d.physicalAddressDate  ? `<pol:PhysicalAddressDate>${esc(d.physicalAddressDate)}</pol:PhysicalAddressDate>` : ''}` : ''}
          ${d.nextOfKinFirstName ? `
          <pol:RelativeRelation>DISTANT</pol:RelativeRelation>
          <pol:Relative>
            <pol:FirstName>${esc(d.nextOfKinFirstName)}</pol:FirstName>
            <pol:LastName>${esc(d.nextOfKinLastName || '')}</pol:LastName>
            <pol:CellNumber>${d.nextOfKinMobile || ''}</pol:CellNumber>
          </pol:Relative>` : ''}
          ${d.employmentType ? `<pol:EmploymentType>${esc(d.employmentType)}</pol:EmploymentType>` : ''}
          ${d.employerName   ? `<pol:EmployerName>${esc(d.employerName)}</pol:EmployerName>` : ''}
          ${d.occupation     ? `<pol:Occupation>${esc(d.occupation)}</pol:Occupation>` : ''}
          ${d.occupationLevel ? `<pol:OccupationLevel>${esc(d.occupationLevel)}</pol:OccupationLevel>` : ''}
          ${d.industry       ? `<pol:Industry>${esc(d.industry)}</pol:Industry>` : ''}
          ${d.currentEmploymentStartDate ? `<pol:CurrentEmploymentStartDate>${esc(d.currentEmploymentStartDate)}</pol:CurrentEmploymentStartDate>` : ''}
          ${d.salaryDay      ? `<pol:SalaryDay>${d.salaryDay}</pol:SalaryDay>` : ''}
          ${d.basicSalary    ? `<pol:BasicSalary>${Number(d.basicSalary).toFixed(2)}</pol:BasicSalary>` : ''}
          ${d.nettSalary     ? `<pol:NettSalary>${Number(d.nettSalary).toFixed(2)}</pol:NettSalary>` : ''}
          ${d.bureauExpenses ? `<pol:LoanRepayments>${Number(d.bureauExpenses).toFixed(2)}</pol:LoanRepayments>` : ''}
          <pol:FundsSource>SALARY</pol:FundsSource>
          <pol:FinanceApplication>
            <pol:CompanyCode>${companyCode}</pol:CompanyCode>
            ${d.depositAmount ? `<pol:DepositValue>${Number(d.depositAmount).toFixed(2)}</pol:DepositValue>` : ''}
            <pol:AgreementType>INSTALMENT SALE</pol:AgreementType>
            <pol:PaymentMethod>DEBIT ORDER</pol:PaymentMethod>
          </pol:FinanceApplication>
          <pol:Consents>
            <pol:DataAttestationInd>${d.dataAttestation ? '1' : '0'}</pol:DataAttestationInd>
            <pol:TelesalesMarketingConsentInd>${d.marketingConsent ? '1' : '0'}</pol:TelesalesMarketingConsentInd>
            <pol:EmailMarketingConsentInd>${d.marketingConsent ? '1' : '0'}</pol:EmailMarketingConsentInd>
            <pol:SMSMarketingConsentInd>${d.marketingConsent ? '1' : '0'}</pol:SMSMarketingConsentInd>
            <pol:IdxConsentInd>${d.financialAccessConsent ? '1' : '0'}</pol:IdxConsentInd>
            <pol:IvxConsentInd>${d.financialAccessConsent ? '1' : '0'}</pol:IvxConsentInd>
          </pol:Consents>
        </pol:Client>
      </pol:Policy>${productsXml}
    </pol:CreatePolicy>
  </soap:Body>
</soap:Envelope>`;
}

// ── Helpers ───────────────────────────────────────────────────

function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function generateSalesRef(branchCode) {
  return `${branchCode}-${Date.now()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
}

function parseEdithXMLResponse(xml) {
  const getTag = (tag) => {
    const match = xml.match(new RegExp(`<[^>]*${tag}[^>]*>([^<]*)<`, 'i'));
    return match ? match[1].trim() : null;
  };
  const statusCode = parseInt(getTag('StatusCode') || getTag('ReturnCode') || '100');
  const policyNumber = getTag('PolicyNumber');
  const errors = [];

  const errorMatches = xml.matchAll(/<Error[^>]*>([\s\S]*?)<\/Error>/gi);
  for (const m of errorMatches) {
    const fieldMatch = m[1].match(/<FieldName[^>]*>([^<]*)<\/FieldName>/i);
    const codeMatch  = m[1].match(/<StatusCode[^>]*>([^<]*)<\/StatusCode>/i);
    const msgMatch   = m[1].match(/<ErrorMessage[^>]*>([^<]*)<\/ErrorMessage>/i);
    if (fieldMatch) {
      errors.push({
        FieldName:    fieldMatch[1],
        StatusCode:   parseInt(codeMatch?.[1] || '300'),
        ErrorMessage: msgMatch?.[1] || '',
      });
    }
  }
  return { statusCode, policyNumber, errors };
}

// ── Structured logging (Cloudflare Workers) ───────────────────

function logError(type, data, env, context = {}) {
  console.error(JSON.stringify({
    level: 'error',
    type,
    ...context,
    data,
    ts: new Date().toISOString(),
    env: env.WORKER_ENV,
  }));
}

function logWarning(type, data, env, context = {}) {
  console.warn(JSON.stringify({
    level: 'warn',
    type,
    ...context,
    data,
    ts: new Date().toISOString(),
    env: env.WORKER_ENV,
  }));
}
