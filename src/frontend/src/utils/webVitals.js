/**
 * Web Vitals Reporter
 * Tracks Core Web Vitals: LCP, CLS, FID/INP, FCP, TTFB
 *
 * In development → logs to console with color coding
 * In production  → can be sent to analytics endpoint (uncomment sendToAnalytics)
 */

const THRESHOLDS = {
  LCP:  { good: 2500,  poor: 4000  },
  FID:  { good: 100,   poor: 300   },
  INP:  { good: 200,   poor: 500   },
  CLS:  { good: 0.1,   poor: 0.25  },
  FCP:  { good: 1800,  poor: 3000  },
  TTFB: { good: 800,   poor: 1800  },
};

function getRating(name, value) {
  const t = THRESHOLDS[name];
  if (!t) return 'unknown';
  if (value <= t.good) return 'good';
  if (value <= t.poor) return 'needs-improvement';
  return 'poor';
}

function getColor(rating) {
  switch (rating) {
    case 'good':              return '#22c55e';
    case 'needs-improvement': return '#f59e0b';
    case 'poor':              return '#ef4444';
    default:                  return '#6b7280';
  }
}

/**
 * Log metric to console (dev) or send to analytics (prod)
 */
function onVital(metric) {
  const rating = getRating(metric.name, metric.value);
  const color  = getColor(rating);

  if (import.meta.env.DEV) {
    console.log(
      `%c[Web Vitals] %c${metric.name}%c ${metric.value.toFixed(2)}${metric.name === 'CLS' ? '' : 'ms'} — ${rating.toUpperCase()}`,
      'color:#7c3aed;font-weight:bold',
      `color:${color};font-weight:bold`,
      'color:#6b7280'
    );
  }

  // ── Production: send to your analytics endpoint ──
  // Uncomment and replace URL when ready:
  //
  // if (!import.meta.env.DEV) {
  //   sendToAnalytics({ name: metric.name, value: metric.value, rating, id: metric.id });
  // }
}

// function sendToAnalytics(payload) {
//   const body = JSON.stringify(payload);
//   if (navigator.sendBeacon) {
//     navigator.sendBeacon('/api/vitals', body);
//   } else {
//     fetch('/api/vitals', { method: 'POST', body, keepalive: true });
//   }
// }

/**
 * Initialize Web Vitals reporting.
 * Call once in main.jsx after app mount.
 */
export async function reportWebVitals() {
  try {
    const { onCLS, onFID, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals');
    onCLS(onVital);
    onFID(onVital);
    onINP(onVital);
    onFCP(onVital);
    onLCP(onVital);
    onTTFB(onVital);
  } catch {
    // web-vitals not supported or blocked — fail silently
  }
}
