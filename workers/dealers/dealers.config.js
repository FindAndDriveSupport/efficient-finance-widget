/**
 * dealers.config.js
 *
 * ████████████████████████████████████████████████████████████████
 *  SINGLE SOURCE OF TRUTH — ALL DEALER SETTINGS LIVE HERE
 *  Add a dealer, change a theme, update branch codes — all in one place.
 * ████████████████████████████████████████████████████████████████
 *
 * Each dealer entry controls:
 *   - Edith branch code
 *   - Whitelisted embed domains
 *   - UI theme (colours, logo)
 *   - Feature flags
 *   - Finance type
 *   - Edith environment (dev | prod)
 *   - Contact email for failure notifications
 *   - Billing type (transaction | fixed)
 *   - Branches (optional — for a single dealer with multiple Edith branch codes)
 *   - Group key (optional — for MULTIPLE, otherwise-independent dealer entries
 *     that belong to the same ownership group, e.g. a "multiple websites,
 *     multiple branches" onboarding setup). Give every entry in the same
 *     group the identical groupKey string. Used by billing-worker to roll
 *     up group members into one invoice line, and by the analytics
 *     dashboard to aggregate metrics across the group.
 */

export const DEALERS = {
  // ─────────────────────────────────────────────────────────────
  // FindnDrive (default / fallback)
  // ─────────────────────────────────────────────────────────────
  'findndrive': {
    name: 'FindnDrive',
    branchCode: 'SRT001EM',
    financeType: 'vehicle',
    edithEnv: 'dev',
    contactEmail: 'support@findndrive.co.za',
    billingType: 'transaction',
    groupKey: null,
    allowedDomains: [
      'findndrive.co.za',
      'www.findndrive.co.za',
      'seritifinancedev.findndrive.co.za',
      'seritifinance.findndrive.co.za',
      'localhost',
      'findanddrivesupport-e-fficient-ui.still-fire-1c3d.workers.dev',
    ],
    theme: {
      primary: '#6C3FC5',
      primaryLight: '#8B5CF6',
      primaryDark: '#4C1D95',
      gradient: 'linear-gradient(135deg, #6C3FC5 0%, #C026D3 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
      logoUrl: '/logos/findndrive.svg',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  // ─────────────────────────────────────────────────────────────
  // Keitzman Finance
  // ─────────────────────────────────────────────────────────────
  'keitzman-finance': {
    name: 'Keitzman Finance',
    branchCode: 'KAEF001',
    financeType: 'vehicle',
    edithEnv: 'prod',
    contactEmail: 'yvette@keitzmanfinance.co.za',
    billingType: 'fixed',
    groupKey: null,
    allowedDomains: [
      'keitzmanfinance.co.za',
      'keitzman-finance.seritifinance.findndrive.co.za',
      'seritifinance.findndrive.co.za',
    ],
    theme: {
      primary: '#c0392b',
      gradient: 'linear-gradient(135deg, #c0392b 0%, #c0392b 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  // ─────────────────────────────────────────────────────────────
  // Yonda Bike
  // ─────────────────────────────────────────────────────────────
  'yonda-bike': {
    name: 'Yonda Bike',
    branchCode: 'YOND001',
    financeType: 'bike',
    edithEnv: 'prod',
    contactEmail: 'marketing@yonda.co.za',
    billingType: 'fixed',
    groupKey: null,
    allowedDomains: [
      'yonda.co.za',
      'yonda-bike.seritifinance.findndrive.co.za',
    ],
    theme: {
      primary: '#0154fc',
      gradient: 'linear-gradient(135deg, #0154fc 0%, #0154fc 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  // ─────────────────────────────────────────────────────────────
  // North Western Motors
  // ─────────────────────────────────────────────────────────────
  'north-western-motors': {
    name: 'North Western Motors',
    branchCode: 'NWMC001',
    financeType: 'vehicle',
    edithEnv: 'prod',
    contactEmail: 'denise@northwestern.co.za',
    billingType: 'transaction',
    groupKey: null,
    allowedDomains: [
      'northwesternmotors.co.za',
      'north-western-motors.seritifinance.findndrive.co.za',
      'seritifinance.findndrive.co.za',
    ],
    theme: {
      primary: '#0a1361',
      gradient: 'linear-gradient(135deg, #0a1361 0%, #0a1361 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },


  'byd-durban': {
    name: 'BYD Durban',
    branchCode: 'ALPI041',
    financeType: 'vehicle',
    edithEnv: 'prod',
    contactEmail: 'RIAANM@ALPINEMOTORS.CO.ZA',
    billingType: 'transaction',
    groupKey: 'Alpine Motors',
    allowedDomains: [
      'https://bydkzn.co.za/',
      'byd-durban.seritifinance.findndrive.co.za',
      'seritifinance.findndrive.co.za',
    ],
    theme: {
      primary: '#5d6e73',
      gradient: 'linear-gradient(135deg, #5d6e73 0%, #5d6e73 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  'byd-hillcrest': {
    name: 'BYD Hillcrest',
    branchCode: 'ALPI042',
    financeType: 'vehicle',
    edithEnv: 'prod',
    contactEmail: 'MICHELEV@ALPINEMOTORS.CO.ZA',
    billingType: 'transaction',
    groupKey: 'Alpine Motors',
    allowedDomains: [
      'https://bydkzn.co.za/',
      'byd-hillcrest.seritifinance.findndrive.co.za',
      'seritifinance.findndrive.co.za',
    ],
    theme: {
      primary: '#5d6e73',
      gradient: 'linear-gradient(135deg, #5d6e73 0%, #5d6e73 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  'byd-pietermaritzburg': {
    name: 'BYD Pietermaritzburg',
    branchCode: 'ALPI043',
    financeType: 'vehicle',
    edithEnv: 'prod',
    contactEmail: 'MICHELEV@ALPINEMOTORS.CO.ZA',
    billingType: 'transaction',
    groupKey: 'Alpine Motors',
    allowedDomains: [
      'https://bydkzn.co.za/',
      'byd-pietermaritzburg.seritifinance.findndrive.co.za',
      'seritifinance.findndrive.co.za',
    ],
    theme: {
      primary: '#5d6e73',
      gradient: 'linear-gradient(135deg, #5d6e73 0%, #5d6e73 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  'gwm-hillcrest': {
    name: 'GWM Hillcrest',
    branchCode: 'ALPI024',
    financeType: 'vehicle',
    edithEnv: 'prod',
    contactEmail: 'ANNELINEB@ALPINEMOTORS.CO.ZA',
    billingType: 'transaction',
    groupKey: 'Alpine Motors',
    allowedDomains: [
      'https://www.gwmhillcrest.co.za/',
      'gwm-hillcrest.seritifinance.findndrive.co.za',
      'seritifinance.findndrive.co.za',
    ],
    theme: {
      primary: '#5d6e73',
      gradient: 'linear-gradient(135deg, #5d6e73 0%, #5d6e73 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  'omoda-jaecoo-pinetown': {
    name: 'Omoda Jaecoo Pinetown',
    branchCode: 'ALPI029',
    financeType: 'vehicle',
    edithEnv: 'prod',
    contactEmail: 'TENEILC@ALPINEMOTORS.CO.ZA',
    billingType: 'transaction',
    groupKey: 'Alpine Motors',
    allowedDomains: [
      'https://www.omodajaecoopinetown.co.za/',
      'omoda-jaecoo-pinetown.seritifinance.findndrive.co.za',
      'seritifinance.findndrive.co.za',
    ],
    theme: {
      primary: '#5d6e73',
      gradient: 'linear-gradient(135deg, #5d6e73 0%, #5d6e73 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  'baic-ballito': {
    name: 'BAIC Ballito',
    branchCode: 'ALPI035',
    financeType: 'vehicle',
    edithEnv: 'prod',
    contactEmail: 'mariuss@alpinemotors.co.za',
    billingType: 'transaction',
    groupKey: 'Alpine Motors',
    allowedDomains: [
      'https://www.baicballito.co.za/',
      'baic-ballito.seritifinance.findndrive.co.za',
      'seritifinance.findndrive.co.za',
    ],
    theme: {
      primary: '#5d6e73',
      gradient: 'linear-gradient(135deg, #5d6e73 0%, #5d6e73 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
      showVehicleSelection: true,
    },
  },

  'baic-pinetown': {
    name: 'BAIC Pinetown',
    branchCode: 'ALPI026',
    financeType: 'vehicle',
    edithEnv: 'prod',
    contactEmail: 'lauram@alpinemotors.co.za',
    billingType: 'transaction',
    groupKey: 'Alpine Motors',
    allowedDomains: [
      'https://www.baicpinetown.co.za/',
      'baic-pinetown.seritifinance.findndrive.co.za',
      'seritifinance.findndrive.co.za',
    ],
    theme: {
      primary: '#5d6e73',
      gradient: 'linear-gradient(135deg, #5d6e73 0%, #5d6e73 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
      showVehicleSelection: true,
    },
  },

  'baic-umhlanga': {
    name: 'BAIC Umhlanga',
    branchCode: 'ALPI027',
    financeType: 'vehicle',
    edithEnv: 'prod',
    contactEmail: 'mackneyn@alpinemotors.co.za',
    billingType: 'transaction',
    groupKey: 'Alpine Motors',
    allowedDomains: [
      'https://www.baic-umhlanga.co.za/',
      'baic-umhlanga.seritifinance.findndrive.co.za',
      'seritifinance.findndrive.co.za',
    ],
    theme: {
      primary: '#5d6e73',
      gradient: 'linear-gradient(135deg, #5d6e73 0%, #5d6e73 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
      showVehicleSelection: true,
    },
  },

  'byd-ballito': {
    name: 'BYD Ballito',
    branchCode: 'ALPI034',
    financeType: 'vehicle',
    edithEnv: 'prod',
    contactEmail: 'mariuss@alpinemotors.co.za',
    billingType: 'transaction',
    groupKey: 'Alpine Motors',
    allowedDomains: [
      'https://bydkzn.co.za/',
      'byd-ballito.seritifinance.findndrive.co.za',
      'seritifinance.findndrive.co.za',
    ],
    theme: {
      primary: '#5d6e73',
      gradient: 'linear-gradient(135deg, #5d6e73 0%, #5d6e73 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
      showVehicleSelection: true,
    },
  },

  'byd-pinetown': {
    name: 'BYD Pinetown',
    branchCode: 'ALPI033',
    financeType: 'vehicle',
    edithEnv: 'prod',
    contactEmail: 'kevinb@alpinemotors.co.za',
    billingType: 'transaction',
    groupKey: 'Alpine Motors',
    allowedDomains: [
      'https://bydkzn.co.za/',
      'byd-pinetown.seritifinance.findndrive.co.za',
      'seritifinance.findndrive.co.za',
    ],
    theme: {
      primary: '#5d6e73',
      gradient: 'linear-gradient(135deg, #5d6e73 0%, #5d6e73 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
      showVehicleSelection: true,
    },
  },

  'jetour-ballito': {
    name: 'JETOUR Ballito',
    branchCode: 'ALPI040',
    financeType: 'vehicle',
    edithEnv: 'prod',
    contactEmail: 'mariuss@alpinemotors.co.za',
    billingType: 'transaction',
    groupKey: 'Alpine Motors',
    allowedDomains: [
      'https://www.jetouralpine.co.za/',
      'jetour-ballito.seritifinance.findndrive.co.za',
      'seritifinance.findndrive.co.za',
    ],
    theme: {
      primary: '#5d6e73',
      gradient: 'linear-gradient(135deg, #5d6e73 0%, #5d6e73 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
      showVehicleSelection: true,
    },
  },

  'jetour-pinetown': {
    name: 'JETOUR Pinetown',
    branchCode: 'ALPI038',
    financeType: 'vehicle',
    edithEnv: 'prod',
    contactEmail: 'kenp@alpinemotors.co.za',
    billingType: 'transaction',
    groupKey: 'Alpine Motors',
    allowedDomains: [
      'https://www.jetouralpine.co.za',
      'jetour-pinetown.seritifinance.findndrive.co.za',
      'seritifinance.findndrive.co.za',
    ],
    theme: {
      primary: '#5d6e73',
      gradient: 'linear-gradient(135deg, #5d6e73 0%, #5d6e73 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
      showVehicleSelection: true,
    },
  },

  'jetour-umhlanga': {
    name: 'JETOUR Umhlanga',
    branchCode: 'ALPI039',
    financeType: 'vehicle',
    edithEnv: 'prod',
    contactEmail: 'darrenvn@alpinemotors.co.za',
    billingType: 'transaction',
    groupKey: 'Alpine Motors',
    allowedDomains: [
      'https://www.jetouralpine.co.za',
      'jetour-umhlanga.seritifinance.findndrive.co.za',
      'seritifinance.findndrive.co.za',
    ],
    theme: {
      primary: '#5d6e73',
      gradient: 'linear-gradient(135deg, #5d6e73 0%, #5d6e73 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
      showVehicleSelection: true,
    },
  },
  // ─────────────────────────────────────────────────────────────
  // ADD MORE DEALERS BELOW — copy a block, change the values
  // ─────────────────────────────────────────────────────────────
};

// ── Lookup helpers ────────────────────────────────────────────

export function getDealerConfig(dealerKey, referringDomain) {
  if (dealerKey && DEALERS[dealerKey]) {
    return { key: dealerKey, ...DEALERS[dealerKey] };
  }

  if (referringDomain) {
    const hostname = referringDomain.replace(/^https?:\/\//, '').split('/')[0];
    for (const [key, config] of Object.entries(DEALERS)) {
      if (config.allowedDomains.some(d => hostname === d || hostname.endsWith(`.${d}`))) {
        return { key, ...config };
      }
    }
  }

  const [firstKey, firstConfig] = Object.entries(DEALERS)[0];
  return { key: firstKey, ...firstConfig };
}

export function isOriginAllowed(origin) {
  if (!origin) return false;
  const hostname = origin.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

  for (const config of Object.values(DEALERS)) {
    if (config.allowedDomains.includes(hostname)) return true;
    if (config.allowedDomains.some(d => hostname.endsWith(`.${d}`))) return true;
  }
  return false;
}

/**
 * Returns all dealer entries sharing a given groupKey, in the same
 * { key, ...config } shape as getDealerConfig. Used by billing-worker and
 * the analytics dashboard to roll up metrics/invoices across a dealer group.
 */
export function getDealersByGroup(groupKey) {
  if (!groupKey) return [];
  return Object.entries(DEALERS)
    .filter(([, config]) => config.groupKey === groupKey)
    .map(([key, config]) => ({ key, ...config }));
}

/**
 * Returns a map of groupKey -> array of dealer entries, for every dealer
 * that belongs to a group. Standalone dealers (groupKey === null) are
 * excluded. Useful for iterating "all groups" in a billing or reporting run.
 */
export function getAllDealerGroups() {
  const groups = new Map();
  for (const [key, config] of Object.entries(DEALERS)) {
    if (!config.groupKey) continue;
    if (!groups.has(config.groupKey)) groups.set(config.groupKey, []);
    groups.get(config.groupKey).push({ key, ...config });
  }
  return groups;
}
