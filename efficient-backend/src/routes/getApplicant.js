/**
 * getApplicant.js — Get applicant data after consent
 * GET /api/financing/applicant?applicantId=xxx
 *
 * Proxies to Seriti GET /api/Financing/GetApplicantById
 * Returns mapped fields for Edith CreatePolicy pre-fill (Step 3)
 */

import { seritiRequest } from '../services/seritiAuth.js';

export async function handleGetApplicant(request, ctx, jsonResponse) {
  const { env, origin } = ctx;
  const url = new URL(request.url);
  const applicantId = url.searchParams.get('applicantId');

  if (!applicantId) {
    return jsonResponse({ error: 'Missing applicantId' }, 400, origin, env);
  }

  const result = await seritiRequest(
    `/api/Financing/GetApplicantById?applicantId=${encodeURIComponent(applicantId)}`,
    { method: 'GET' },
    env
  );

  // Map Seriti fields → app form fields (per edith-createpolicy-data-mapping)
  // Only expose what the frontend needs to pre-fill Step 3
  return jsonResponse({
    // Personal
    title:       result.title,
    firstName:   result.firstName,
    lastName:    result.lastName,
    mobileNumber: result.mobileNumber,
    emailAddress: result.emailAddress,
    idNumber:    result.idNumber,
    gender:      result.gender,
    birthDate:   result.birthDate,
    educationLevel: result.educationLevel,
    // Address
    address1:    result.address?.address1,
    suburb:      result.address?.suburb,
    city:        result.address?.city,
    province:    result.address?.province,
    postCode:    result.address?.postCode,
    country:     result.address?.country || 'ZA',
    residentialStatus: result.address?.residentialStatus,
    maritalStatus: result.maritalStatus,
    // Employment
    employmentType:   result.employment?.employmentType,
    employerName:     result.employment?.employerName,
    industry:         result.employment?.industry,
    occupation:       result.employment?.occupation,
    occupationLevel:  result.employment?.occupationLevel,
    currentEmploymentStartDate: result.employment?.startDate,
    employmentAddress: result.employment?.address,
    workTelephoneCode:   result.employment?.workTelCode,
    workTelephoneNumber: result.employment?.workTelNumber,
    salaryDay: result.employment?.salaryDay,
    // Financials
    basicSalary: result.financials?.basicSalary,
    nettSalary:  result.financials?.nettSalary,
    // Finance application
    financeApplications: result.financeApplications,
    // Consents (pre-tick if returned)
    dataAttestationInd: result.consents?.dataAttestation,
    telesalesConsent:   result.consents?.telesalesMarketing,
    emailConsent:       result.consents?.emailMarketing,
    smsConsent:         result.consents?.smsMarketing,
    idxConsent:         result.consents?.idx,
    ivxConsent:         result.consents?.ivx,
  }, 200, origin, env);
}
