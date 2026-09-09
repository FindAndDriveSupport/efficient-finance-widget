/**
 * routes/partialLead.js
 * Receives a drop-off/partial lead via sendBeacon from a finance app
 * before the applicant completes a full submission, and forwards it to
 * queue-worker for CRM delivery (DealerOS).
 *
 * ⚠️ PLACEHOLDERS BELOW — not yet confirmed:
 * 1. DealerOS credential KV binding name + key format — still unknown.
 * 2. queue-worker's actual entry point/payload contract — still unknown
 *    (this assumes a service binding "QUEUE_WORKER" and a
 *    /process-lead endpoint, matching the shape discussed earlier in
 *    conversation, but neither has been confirmed against queue-worker's
 *    real code).
 * Do not treat this as working until both are verified.
 */

export async function handlePartialLead(request, ctx, jsonResponse) {
  const { env, origin, dealerConfig } = ctx;
  const body = await request.json();
  const { dealerKey, firstName, lastName, idNumber, mobileNumber, vehicleMake, vehicleModel } = body;

  // ⚠️ PLACEHOLDER — confirm the real KV binding name and key pattern
  // before relying on this. Do not deploy without verifying.
  const dealerosToken = await env.DEALEROS_CREDS_KV?.get(`DEALEROS_TOKEN_${dealerKey}`);
  const dealershipId  = await env.DEALEROS_CREDS_KV?.get(`DEALEROS_DEALERSHIP_ID_${dealerKey}`);

  if (!dealerosToken || !dealershipId) {
    console.error(JSON.stringify({
      level: 'error',
      type: 'partial_lead_dealeros_creds_missing',
      dealerKey,
      ts: new Date().toISOString(),
    }));
    return new Response(null, { status: 202 }); // sendBeacon has no error handling client-side
  }

  const dest = {
    type: 'dealeros',
    dealerosToken,
    dealershipId,
    leadSource: 'DEALER_WEBSITE_ORGANIC',
    enquiryMethod: 'WEBSITE',
  };

  const lead = {
    firstName,
    lastName,
    idNumber,
    mobileNumber,
    vehicleMake,
    vehicleModel,
    date: new Date().toISOString().slice(0, 10),
  };

  // ⚠️ PLACEHOLDER — confirm QUEUE_WORKER service binding exists in
  // wrangler.toml and that /process-lead is the real entry point/shape
  // queue-worker expects, before relying on this.
  ctx.ctx.waitUntil(
    env.QUEUE_WORKER.fetch('https://internal/process-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dealerKey,
        branchCode: dealerConfig.branchCode,
        intent: 'partialLead',
        lead,
        approvalChance: null,
        destinations: [dest],
      }),
    }).catch((err) => console.error('[partial-lead] queue-worker call failed:', err.message))
  );

  return new Response(null, { status: 202 });
}