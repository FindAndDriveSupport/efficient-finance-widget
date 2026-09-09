/**
 * routes/partialLead.js
 * Receives a drop-off/partial lead via sendBeacon from a finance app
 * before the applicant completes a full submission, and forwards it to
 * queue-worker's confirmed POST /process-lead contract for CRM delivery
 * (DealerOS).
 *
 * ⚠️ STILL UNCONFIRMED: KV binding name is confirmed as LEADS_SYNC_CONFIG
 * (id 352dc4a8e9244b88b315a12590fd6a1a), but the exact KEY FORMAT within
 * it for DealerOS credentials is not yet confirmed — the two-key pattern
 * below (DEALEROS_TOKEN_/DEALEROS_DEALERSHIP_ID_) mirrors Seriti's naming
 * convention as a best guess, but this KV may instead store one combined
 * JSON blob per dealer, or use different key names entirely. queue-worker's
 * file header also states dealer destinations are normally built by
 * cron-worker's dispatch stage — reusing that function directly (if
 * accessible) would be more reliable than this standalone lookup. Confirm
 * against the real KV contents (dashboard → Workers & Pages → KV →
 * LEADS_SYNC_CONFIG → browse keys for car-factory-outlet) before trusting
 * this in production.
 */

export async function handlePartialLead(request, ctx, jsonResponse) {
  const { env, origin, dealerConfig } = ctx;
  const body = await request.json();
  const { dealerKey, firstName, lastName, idNumber, mobileNumber, vehicleMake, vehicleModel } = body;

  // ⚠️ PLACEHOLDER key format — see file header.
  const dealerosToken = await env.LEADS_SYNC_CONFIG?.get(`DEALEROS_TOKEN_${dealerKey}`);
  const dealershipId  = await env.LEADS_SYNC_CONFIG?.get(`DEALEROS_DEALERSHIP_ID_${dealerKey}`);

  if (!dealerosToken || !dealershipId) {
    console.error(JSON.stringify({
      level: 'error',
      type: 'partial_lead_dealeros_creds_missing',
      dealerKey,
      ts: new Date().toISOString(),
    }));
    return new Response(null, { status: 202 }); // sendBeacon has no client-side error handling anyway
  }

  const dest = {
    type: 'dealeros', // ⚠️ unconfirmed value
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

  // Matches queue-worker's confirmed contract: POST /process-lead with
  // { dealerKey, branchCode, intent, lead, approvalChance, destinations }.
  ctx.waitUntil(
    env.QUEUE_WORKER.fetch('https://internal/process-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dealerKey,
        branchCode: dealerConfig.branchCode,
        intent: 'incomplete application',
        lead,
        approvalChance: null,
        destinations: [dest],
      }),
    }).catch((err) => console.error('[partial-lead] queue-worker call failed:', err.message))
  );

  return new Response(null, { status: 202 });
}