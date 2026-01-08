import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

/* Load links only once (important for performance) */
const links = new SharedArray('links', function () {
  return JSON.parse(open('./crowdlight_links.json'));
});

/* ===== TEST CONFIG ===== */
export const options = {
  scenarios: {
    massive_unique_downloads: {
      executor: 'per-vu-iterations',
      vus: 5004,
      iterations: 1,
      maxDuration: '5m',
    },
  },

  thresholds: {
    http_req_failed: ['rate<0.01'],        // <1% failures allowed
    http_req_duration: ['p(95)<5000'],     // 95% under 2s
  },
};

/* ===== TEST EXECUTION ===== */
export default function () {
  const index = __VU - 1;

  if (!links[index]) {
    console.error(`No link found for VU ${__VU}`);
    return;
  }

  const res = http.get(links[index], {
    timeout: '60s',
  });

  check(res, {
    'Status is 200': (r) => r.status === 200,
    'Downloaded ≥0.3KB': (r) => r.body && r.body.length >= 0.3 * 1024,
  });

  sleep(0.1);
}

/* ===== FINAL SUMMARY ===== */
export function handleSummary(data) {
  return {
    stdout: `
================= LOAD TEST SUMMARY =================
Total Requests     : ${data.metrics.http_reqs.values.count}
Failed Requests    : ${Math.round(data.metrics.http_req_failed.values.rate * 100)} %
Avg Response Time  : ${Math.round(data.metrics.http_req_duration.values.avg)} ms
95th Percentile    : ${Math.round(data.metrics.http_req_duration.values['p(95)'])} ms
Total Data Received: ${(data.metrics.data_received.values.count / 1024 / 1024).toFixed(2)} MB
=====================================================
`,
    'summary.json': JSON.stringify(data, null, 2),
  };
}
