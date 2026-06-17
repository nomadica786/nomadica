import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate, Counter } from 'k6/metrics';

// Custom metrics to track rate limiting and success counts
export const rateLimitedRequests = new Counter('rate_limited_requests');
export const successfulRequests = new Counter('successful_requests');
export const checkFailureRate = new Rate('check_failure_rate');

export const options = {
  scenarios: {
    // 1. Smoke test: Single user browsing to verify system correctness
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '10s',
      exec: 'smokeTest',
    },
    // 2. Load test: Simulating normal load below rate limit thresholds
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 5 },  // Ramp up to 5 users
        { duration: '40s', target: 5 },  // Stay at 5 users
        { duration: '20s', target: 0 },  // Ramp down
      ],
      exec: 'userBrowsingFlow',
    },
    // 3. Rate limit stress test: Bombarding /api endpoints to trigger and verify 429 Rate Limiting
    rate_limit_test: {
      executor: 'constant-vus',
      vus: 15, // High VUs making rapid requests to trigger 429s (exceeding 30 tokens cap / 5 refill/sec)
      duration: '30s',
      exec: 'stressRateLimiting',
    },
  },
  thresholds: {
    // Overall metrics threshold
    'http_req_failed': ['rate<0.4'], // Expect failure rate below 40% (since rate-limited 429s are counted as failures by default)
    'http_req_duration': ['p(95)<1500'], // 95% of requests should be below 1.5s
  },
};

const BASE_URL = 'https://nomadica-orcin.vercel.app';

// Helper to handle requests and record custom metrics
function sendRequest(method, url, body = null, params = {}) {
  let res;
  if (method === 'POST') {
    res = http.post(url, body, params);
  } else {
    res = http.get(url, params);
  }

  if (res.status === 429) {
    rateLimitedRequests.add(1);
  } else if (res.status === 200) {
    successfulRequests.add(1);
  }

  return res;
}

// Scenario 1: Smoke Test
export function smokeTest() {
  const res = sendRequest('GET', `${BASE_URL}/`);
  const success = check(res, {
    'home status is 200': (r) => r.status === 200,
  });
  checkFailureRate.add(!success);
  sleep(1);
}

// Scenario 2: Normal User Browsing Flow (Below rate limits)
export function userBrowsingFlow() {
  // Step 1: Browse home page
  let res = sendRequest('GET', `${BASE_URL}/`);
  let success = check(res, { 'home page status is 200': (r) => r.status === 200 });
  checkFailureRate.add(!success);
  sleep(2);

  // Step 2: Fetch collections list
  res = sendRequest('GET', `${BASE_URL}/api/collections`);
  success = check(res, { 'collections list status is 200': (r) => r.status === 200 });
  checkFailureRate.add(!success);
  sleep(2);

  // Step 3: Fetch products list
  res = sendRequest('GET', `${BASE_URL}/api/products?first=10`);
  success = check(res, { 'products API status is 200': (r) => r.status === 200 });
  checkFailureRate.add(!success);
  sleep(3);
}

// Scenario 3: Stress Rate Limiting (Flood requests to trigger 429s)
export function stressRateLimiting() {
  // Rapidly poll the products endpoint to exhaust the token bucket capacity
  const res = sendRequest('GET', `${BASE_URL}/api/products?first=5`);
  
  // We check for either 200 (allowed) or 429 (rate limited), both are valid system behaviors
  const success = check(res, {
    'status is 200 or 429': (r) => r.status === 200 || r.status === 429,
    'correct headers present': (r) => r.headers['X-Ratelimit-Limit'] !== undefined,
  });
  
  checkFailureRate.add(!success);
  sleep(0.05); // high frequency sleep to maintain load
}