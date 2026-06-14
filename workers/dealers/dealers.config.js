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
 *   - Mixpanel tracking token
 *   - Feature flags
 */

export const DEALERS = {
  // ─────────────────────────────────────────────────────────────
  // EXAMPLE DEALER 1 — FindnDrive (default / fallback)
  // ─────────────────────────────────────────────────────────────
  'findndrive': {
    name: 'FindnDrive',
    branchCode: 'SRT001EM',                    // ← Edith BranchCode
    allowedDomains: [
      'findndrive.co.za',
      'www.findndrive.co.za',
      'localhost',
      'findanddrivesupport-e-fficient-ui.still-fire-1c3d.workers.dev',
    ],
    mixpanelToken: 'YOUR_MIXPANEL_TOKEN',    // ← single MP account; refer domain identifies dealer
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
      vehicleQueryParams: true,              // accepts ?make=&model=&mm= in embed URL
    },
  },

  // ─────────────────────────────────────────────────────────────
  // EXAMPLE DEALER 2 — Car Dealer XYZ
  // ─────────────────────────────────────────────────────────────
  'dealer-xyz': {
    name: 'Car Dealer XYZ',
    branchCode: 'XYZ002',
    allowedDomains: [
      'dealerxyz.co.za',
      'www.dealerxyz.co.za',
    ],
    mixpanelToken: 'YOUR_MIXPANEL_TOKEN',   // same MP account; domain differentiates
    theme: {
      primary: '#E63946',
      primaryLight: '#FF6B6B',
      primaryDark: '#9B0000',
      gradient: 'linear-gradient(135deg, #E63946 0%, #FF6B6B 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '8px',
      logoUrl: '/logos/dealer-xyz.svg',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: false,
      vehicleQueryParams: true,
    },
  },

  // ─────────────────────────────────────────────────────────────
  // ADD MORE DEALERS BELOW — copy a block, change the values
  // ─────────────────────────────────────────────────────────────
};


  'find-and-drive': {
    name: 'Find and Drive',
    branchCode: 'SRT001EM',
    allowedDomains: [
      'findndrive.co.za',
    ],
    mixpanelToken: '',
    theme: {
      primary: '#6c3fc5',
      gradient: 'linear-gradient(135deg, #6c3fc5 0%, #c026d3 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  'find-and-drive-test': {
    name: 'Find and Drive Test',
    branchCode: 'SRT001EM',
    allowedDomains: [
      'findndrive.co.za',
    ],
    mixpanelToken: '',
    theme: {
      primary: '#6c3fc5',
      gradient: 'linear-gradient(135deg, #6c3fc5 0%, #c026d3 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  'find-and-drive-test': {
    name: 'Find and Drive Test',
    branchCode: 'SRT001EM',
    allowedDomains: [
      'findndrive.co.za',
    ],
    mixpanelToken: '',
    theme: {
      primary: '#6c3fc5',
      gradient: 'linear-gradient(135deg, #6c3fc5 0%, #c026d3 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  'find-and-drive-test': {
    name: 'Find and Drive Test',
    branchCode: 'SRT001EM',
    allowedDomains: [
      'findndrive.co.za',
    ],
    mixpanelToken: '',
    theme: {
      primary: '#6c3fc5',
      gradient: 'linear-gradient(135deg, #6c3fc5 0%, #c026d3 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  'find-and-drive-test': {
    name: 'Find and Drive Test',
    branchCode: 'SRT001EM',
    allowedDomains: [
      'findndrive.co.za',
    ],
    mixpanelToken: '',
    theme: {
      primary: '#6c3fc5',
      gradient: 'linear-gradient(135deg, #6c3fc5 0%, #c026d3 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  'find-and-drive-test': {
    name: 'Find and Drive Test',
    branchCode: 'SRT001EM',
    allowedDomains: [
      'findndrive.co.za',
    ],
    mixpanelToken: '',
    theme: {
      primary: '#6c3fc5',
      gradient: 'linear-gradient(135deg, #6c3fc5 0%, #c026d3 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  'find-and-drive-test': {
    name: 'Find and Drive Test',
    branchCode: 'SRT001EM',
    allowedDomains: [
      'findndrive.co.za',
    ],
    mixpanelToken: '',
    theme: {
      primary: '#6c3fc5',
      gradient: 'linear-gradient(135deg, #6c3fc5 0%, #c026d3 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  'find-and-drive-test-2': {
    name: 'Find and Drive Test 2',
    branchCode: 'SRT001EM',
    allowedDomains: [
      'findndrive.co.za',
    ],
    mixpanelToken: '',
    theme: {
      primary: '#6c3fc5',
      gradient: 'linear-gradient(135deg, #6c3fc5 0%, #c026d3 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  'find-and-drive-test-3': {
    name: 'Find and Drive Test 3',
    branchCode: 'SRT001EM',
    allowedDomains: [
      'findndrive.co.za',
    ],
    mixpanelToken: '',
    theme: {
      primary: '#6c3fc5',
      gradient: 'linear-gradient(135deg, #6c3fc5 0%, #c026d3 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  'find-and-drive-test-4': {
    name: 'Find and Drive Test 4',
    branchCode: 'SRT001EM',
    allowedDomains: [
      'findndrive.co.za',
    ],
    mixpanelToken: '',
    theme: {
      primary: '#6c3fc5',
      gradient: 'linear-gradient(135deg, #6c3fc5 0%, #c026d3 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  'find-and-drive-test-5': {
    name: 'Find and Drive Test 5',
    branchCode: 'SRT001EM',
    allowedDomains: [
      'findndrive.co.za',
    ],
    mixpanelToken: '',
    theme: {
      primary: '#6c3fc5',
      gradient: 'linear-gradient(135deg, #6c3fc5 0%, #c026d3 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  'find-and-drive-test-6': {
    name: 'Find and Drive Test 6',
    branchCode: 'SRT001EM',
    allowedDomains: [
      'findndrive.co.za',
    ],
    mixpanelToken: '',
    theme: {
      primary: '#6c3fc5',
      gradient: 'linear-gradient(135deg, #6c3fc5 0%, #c026d3 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  'keitzman-finance': {
    name: 'Keitzman Finance',
    branchCode: 'KAEF001',
    allowedDomains: [
      'keitzmanfinance.co.za',
    ],
    mixpanelToken: '',
    theme: {
      primary: '#c0392b',
      gradient: 'linear-gradient(135deg, #c0392b 0%, #c026d3 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  'keitzman-finance': {
    name: 'Keitzman Finance',
    branchCode: 'KAEF001',
    allowedDomains: [
      'keitzmanfinance.co.za',
    ],
    mixpanelToken: '',
    theme: {
      primary: '#c0392b',
      gradient: 'linear-gradient(135deg, #c0392b 0%, #c026d3 100%)',
      fontFamily: "'Inter', sans-serif",
      borderRadius: '12px',
    },
    features: {
      showDeposit: true,
      showCurrentFinance: true,
      vehicleQueryParams: true,
    },
  },

  'keitzman-finance': {
    name: 'Keitzman Finance',
    branchCode: 'KAEF001',
    allowedDomains: [
      'keitzmanfinance.co.za',
      'seritifinance.findndrive.co.za',
    ],
    mixpanelToken: '',
    financeType: 'vehicle',
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

  'keitzman-finance': {
    name: 'Keitzman Finance',
    branchCode: 'KAEF001',
    allowedDomains: [
      'keitzmanfinance.co.za',
      'seritifinance.findndrive.co.za',
    ],
    mixpanelToken: '',
    financeType: 'vehicle',
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
// ── Lookup helpers ────────────────────────────────────────────

/**
 * Get dealer config by branchCode query param or referring domain.
 * Priority: explicit ?dealer= param → referring domain match → null
 */
export function getDealerConfig(dealerKey, referringDomain) {
  // 1. Explicit key (from query param ?dealer=findndrive)
  if (dealerKey && DEALERS[dealerKey]) {
    return { key: dealerKey, ...DEALERS[dealerKey] };
  }

  // 2. Match by referring domain
  if (referringDomain) {
    const hostname = referringDomain.replace(/^https?:\/\//, '').split('/')[0];
    for (const [key, config] of Object.entries(DEALERS)) {
      if (config.allowedDomains.some(d => hostname === d || hostname.endsWith(`.${d}`))) {
        return { key, ...config };
      }
    }
  }

  // 3. Fallback to first dealer (or null — your choice)
  const [firstKey, firstConfig] = Object.entries(DEALERS)[0];
  return { key: firstKey, ...firstConfig };
}

/**
 * Check whether a given origin is whitelisted for any dealer.
 * Used by the CORS / embed middleware.
 */
export function isOriginAllowed(origin) {
  if (!origin) return false;
  const hostname = origin.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

  for (const config of Object.values(DEALERS)) {
    if (config.allowedDomains.includes(hostname)) return true;
    if (config.allowedDomains.some(d => hostname.endsWith(`.${d}`))) return true;
  }
  return false;
}
