import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import exec from 'k6/execution';

const links = new SharedArray('links', function () {
  return JSON.parse(open('./links.json'));
});

export const options = {
  stages: [
    { duration: '1m', target: 2000 }, // විනාඩි 1ක් ඇතුළත users 0 සිට 2000 දක්වා වැඩි කරන්න (Ramp-up)
    { duration: '3m', target: 6000 }, // ඊළඟ විනාඩි 3 ඇතුළත 2000 සිට 6000 දක්වා වැඩි කරන්න
    { duration: '5m', target: 6000 }, // විනාඩි 5ක් 6000 මට්ටමේ පවත්වා ගන්න (Plateau/Soak)
    { duration: '1m', target: 0 },    // අවසාන විනාඩිය ඇතුළත users 0 දක්වා අඩු කරන්න (Ramp-down)
  ],

  discardResponseBodies: true,

  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<5000'],
  },
};

export default function () {
  // සෑම iteration එකකටම unique link එකක් ලබා ගැනීමට
  const index = exec.scenario.iterationInTest;

  if (index >= links.length) {
    return; // Links ඉවර වුණොත් නතර කරන්න
  }

  const res = http.get(links[index], {
    timeout: '60s',
    tags: { name: 'UniqueDownload' },
  });

  check(res, {
    'Status 200': (r) => r.status === 200,
    'Size Check': (r) => parseInt(r.headers['Content-Length'] || '0') >= 400,
  });

  // Users ලා අතර පොඩි පරතරයක් තැබීමෙන් පද්ධතිය වඩාත් ස්ථාවර වේ
  sleep(1);
}

export function handleSummary(data) {
  return {
    stdout: `
================= STAGED LOAD TEST SUMMARY =================
Total Requests     : ${data.metrics.http_reqs.values.count}
Avg Response Time  : ${data.metrics.http_req_duration.values.avg.toFixed(2)} ms
95th Percentile    : ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)} ms
Success Rate       : ${((1 - data.metrics.http_req_failed.values.rate) * 100).toFixed(2)} %
============================================================
`,
  };
}