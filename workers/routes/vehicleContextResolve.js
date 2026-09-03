/**
 * POST /api/v1/vehicle-context/resolve
 *
 * Called by the E-fficient widget for BOTH:
 *  - normalizing a raw JSON-LD "name" string into {year, make, model}
 *  - the final resolve step once the widget already has {year, make, model}
 *
 * Treats everything from the page as untrusted input (spec §10) — validated
 * and, where possible, matched against the Find&Drive vehicle reference
 * table (vehicle_stock) so we return a canonical make/model rather than
 * trusting the page.
 *
 * Expects env.DB bound to the D1 database holding vehicle_stock.
 */

const MULTI_WORD_MAKES = ['Mercedes-Benz', 'Land Rover', 'Alfa Romeo', 'Great Wall', 'Aston Martin'];

/**
 * Adjust the export/signature here to match how your router calls the other
 * files in this folder (e.g. if preQual.js exports `handlePreQual(request, env)`
 * instead, rename this to match and drop the wrapping object).
 */
export async function handleVehicleContextResolve(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ resolved: false, error: 'invalid_json' }, 400);
  }

  const year = sanitizeYear(body.year);

  // Case 1: widget already has separated make/model (from structured JSON-LD fields).
  if (body.make && body.model && year) {
    const resolved = await resolveCanonical(env.DB, year, sanitizeText(body.make), sanitizeText(body.model));
    return jsonResponse(resolved);
  }

  // Case 2: widget only has a combined free-text name — parse it here, server-side.
  if (body.name) {
    const parsed = parseVehicleName(sanitizeText(body.name), year);
    if (!parsed) {
      return jsonResponse({ resolved: false });
    }
    const resolved = await resolveCanonical(env.DB, parsed.year, parsed.make, parsed.model);
    return jsonResponse(resolved);
  }

  return jsonResponse({ resolved: false }, 400);
}

/**
 * Three-tier canonicalization against the vehicle reference table:
 *  1. Exact match — same year, same make, same model.
 *  2. Fuzzy match — same make, model matched on its leading word (e.g. "Puma",
 *     "T-Roc", "Tiggo"), nearest year within stock if the exact year isn't there.
 *     Handles trim/variant text riding along in the page's model string.
 *  3. No match — page-derived value is still returned (the widget needs
 *     *something* to pre-populate with), but flagged canonical:false so the
 *     finance flow / analytics can tell it wasn't verified against our data.
 *
 * Returns: { resolved, canonical, matchType: 'exact'|'fuzzy'|'none', year, make, model }
 */
async function resolveCanonical(db, year, make, model) {
  const exact = await db
    .prepare(
      `SELECT DISTINCT year, make, model FROM vehicle_stock
       WHERE year = ?1 AND make = ?2 COLLATE NOCASE AND model = ?3 COLLATE NOCASE
       LIMIT 1`
    )
    .bind(year, make, model)
    .first();

  if (exact) {
    return { resolved: true, canonical: true, matchType: 'exact', ...exact };
  }

  const leadWord = leadingModelWord(model);
  if (leadWord) {
    const fuzzy = await db
      .prepare(
        `SELECT DISTINCT year, make, model FROM vehicle_stock
         WHERE make = ?1 COLLATE NOCASE AND model LIKE ?2 COLLATE NOCASE
         ORDER BY ABS(year - ?3) ASC
         LIMIT 1`
      )
      .bind(make, `${leadWord}%`, year)
      .first();

    if (fuzzy) {
      return { resolved: true, canonical: true, matchType: 'fuzzy', ...fuzzy };
    }
  }

  // Nothing in the reference table — pass the page-derived value through unmatched.
  return { resolved: true, canonical: false, matchType: 'none', year, make, model };
}

/** First significant token of a model string, used as the fuzzy-match anchor (e.g. "Puma" from "Puma 1.0t Ecoboost St-line"). */
function leadingModelWord(model) {
  const word = model.trim().split(/\s+/)[0];
  return word && word.length >= 2 ? word : null;
}

/** Mirrors the JSON-LD parsing rule from spec §6: don't naively split on spaces. */
function parseVehicleName(rawName, yearHint) {
  let text = rawName.trim();

  // Strip a leading duplicate year token, e.g. "2025 Volkswagen Polo Vivo ..."
  const leadingYearMatch = text.match(/^(\d{4})\s+/);
  const year = yearHint ?? (leadingYearMatch ? Number(leadingYearMatch[1]) : undefined);
  if (leadingYearMatch) text = text.slice(leadingYearMatch[0].length);

  if (!year) return null; // spec requires year; refuse to guess one

  const upper = text.toUpperCase();
  let make = null;
  let rest = text;

  for (const mw of MULTI_WORD_MAKES) {
    if (upper.startsWith(mw.toUpperCase())) {
      make = mw;
      rest = text.slice(mw.length).trim();
      break;
    }
  }

  if (!make) {
    const words = text.split(/\s+/);
    if (words.length === 0 || !words[0]) return null;
    make = titleCase(words[0]);
    rest = words.slice(1).join(' ');
  }

  // Model is the next token(s) up to where trim/engine spec typically starts
  // (a digit, displacement unit, or known trim-starting pattern). This is a
  // conservative heuristic — the D1 lookup above is what actually canonicalizes it.
  const model = rest.split(/\s+(?=\d)/)[0].trim() || rest.trim();

  if (!make || !model) return null;
  return { year, make, model: titleCase(model) };
}

function sanitizeYear(year) {
  const n = typeof year === 'number' ? year : Number(year);
  if (!Number.isInteger(n) || n < 1980 || n > 2100) return undefined;
  return n;
}

function sanitizeText(s) {
  // Strip anything that isn't plausible vehicle-name text; defence against
  // script-like or otherwise unexpected content smuggled in via JSON-LD.
  return s.replace(/[<>{}$`]/g, '').trim().slice(0, 200);
}

function titleCase(s) {
  return s === s.toUpperCase() ? s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()) : s;
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
