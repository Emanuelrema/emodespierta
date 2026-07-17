import http from 'http';

const req = http.request(
  {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/personas',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // We need the cookie. But I can't easily get it.
    }
  }
);
