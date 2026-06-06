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
  const applicantId = url.pathname.split('/').pop();

  if (!applicantId) {
    return jsonResponse({ error: 'Missing applicantId' }, 400, origin, env);
  }

  let result;
  try {
    result = await seritiRequest(
      `/api/Financing/GetApplicantById?id=${encodeURIComponent(applicantId)}`,
      { method: 'GET' },
      env
    );
  } catch (err) {
    return jsonResponse({ error: 'Seriti API error', details: err.message }, 502, origin, env);
  }

  const applicant = result.response?.applicant || {};
  const employment = applicant.applicantEmploymentHistory || {};
  const address = applicant.applicantAddress || {};
  const financials = applicant.applicantFinance || {};

  return jsonResponse({
    // Personal
    title: applicant.title,
    firstName: applicant.firstName,
    lastName: applicant.lastName,
    mobileNumber: applicant.mobileNumber,
    emailAddress: applicant.emailAddress,
    idNumber: applicant.idNumber,
    gender: applicant.gender,
    dateOfBirth: applicant.dateOfBirth,
    maritalStatus: applicant.maritalStatus,
    // Address
    address1: address.line1,
    suburb: address.township,
    township: address.township,
    postalCode: address.postalCode,
    city: address.city,
    province: address.province,
    postCode: address.postalCode,
    residentialStatus: address.residentialStatus,
    // Employment
    employmentType: employment.employmentType,
    employerName: applicant.latestCompanyName,
    industry: employment.industry,
    occupation: employment.occupation,
    // Financials
    grossIncome: financials.grossIncome,
    netIncome: financials.netIncome,
    bureauExpenses: financials.bureauExpenses,
  }, 200, origin, env);
}