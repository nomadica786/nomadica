import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  cloud: {
    // Project: Default project
    projectID: 7838371,
    // Test runs with the same name groups test runs together.
    name: 'Test (16/06/2026-11:40:00)'
  }
};

export default function() {
  http.get('https://nomadica-orcin.vercel.app');
  sleep(1);
}