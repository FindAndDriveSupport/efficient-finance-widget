/**
 * routes/vehicleStock.js
 * Vehicle stock lookups for Car Factory Outlet's live inventory
 * (vehicle_stock table — vehicle_no, reg_no, year, make, model, mmcode).
 * No dealer/branch column on this table — it holds only carfo's stock,
 * so no WHERE-clause scoping is needed.
 */

export async function handleVehicleStockMakes(request, ctx, jsonResponse) {
  const { env, origin } = ctx;
  const url = new URL(request.url);
  const query = (url.searchParams.get('q') || '').trim();

  try {
    let results;
    if (query.length < 1) {
      const { results: rows } = await env.DB.prepare(
        `SELECT DISTINCT make AS name FROM vehicle_stock ORDER BY make ASC LIMIT 1000`
      ).all();
      results = rows;
    } else {
      const { results: rows } = await env.DB.prepare(
        `SELECT DISTINCT make AS name FROM vehicle_stock WHERE make LIKE ?1 ORDER BY make ASC LIMIT 1000`
      ).bind(`%${query}%`).all();
      results = rows;
    }
    return jsonResponse({ results }, 200, origin, env);
  } catch (err) {
    console.error('Vehicle stock makes lookup error:', err.message, err.stack);
    return jsonResponse({ error: 'Lookup failed', details: err.message }, 500, origin, env);
  }
}

export async function handleVehicleStockModels(request, ctx, jsonResponse) {
  const { env, origin } = ctx;
  const url = new URL(request.url);
  const query = (url.searchParams.get('q') || '').trim();
  const makeFilter = (url.searchParams.get('make') || '').trim();

  if (!makeFilter) {
    return jsonResponse({ error: 'Missing required "make" query parameter' }, 400, origin, env);
  }

  try {
    let results;
    if (query.length < 1) {
      const { results: rows } = await env.DB.prepare(
        `SELECT DISTINCT model AS name FROM vehicle_stock WHERE make = ?1 ORDER BY model ASC LIMIT 1000`
      ).bind(makeFilter).all();
      results = rows;
    } else {
      const { results: rows } = await env.DB.prepare(
        `SELECT DISTINCT model AS name FROM vehicle_stock WHERE make = ?1 AND model LIKE ?2 ORDER BY model ASC LIMIT 1000`
      ).bind(makeFilter, `%${query}%`).all();
      results = rows;
    }
    return jsonResponse({ results }, 200, origin, env);
  } catch (err) {
    console.error('Vehicle stock models lookup error:', err.message, err.stack);
    return jsonResponse({ error: 'Lookup failed', details: err.message }, 500, origin, env);
  }
}

export async function handleVehicleStockMmcode(request, ctx, jsonResponse) {
  const { env, origin } = ctx;
  const url = new URL(request.url);
  const make = (url.searchParams.get('make') || '').trim();
  const model = (url.searchParams.get('model') || '').trim();

  if (!make || !model) {
    return jsonResponse({ error: 'Missing required "make" and "model" query parameters' }, 400, origin, env);
  }

  try {
    const row = await env.DB.prepare(
      `SELECT mmcode FROM vehicle_stock WHERE make = ?1 AND model = ?2 AND mmcode IS NOT NULL LIMIT 1`
    ).bind(make, model).first();

    if (row?.mmcode) {
      return jsonResponse({ resolved: true, mmcode: row.mmcode }, 200, origin, env);
    }
    return jsonResponse({ resolved: false }, 200, origin, env);
  } catch (err) {
    console.error('Vehicle stock mmcode lookup error:', err.message, err.stack);
    return jsonResponse({ error: 'Lookup failed', details: err.message }, 500, origin, env);
  }
}