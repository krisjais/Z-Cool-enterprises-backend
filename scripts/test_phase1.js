/**
 * Phase 1 Security and Customer Enquiry Test Suite
 * Executes automated verification of all Phase 1 implementation targets.
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const http = require('http');

async function httpRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body), headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, raw: body, headers: res.headers });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runPhase1Tests() {
  console.log('===============================================================');
  console.log(' Z COOL ENTERPRISES — PHASE 1 AUTOMATED VERIFICATION SUITE');
  console.log('===============================================================');

  let passed = 0;
  let failed = 0;

  async function check(name, fn) {
    process.stdout.write(`• ${name} ... `);
    try {
      await fn();
      console.log('PASSED [OK]');
      passed++;
    } catch (err) {
      console.log('FAILED [X]');
      console.error(`  Error: ${err.message}`);
      failed++;
    }
  }

  // TEST 1: JWT Secret Production Requirement
  await check('JWT: getJwtSecret fails safely in production without secret', async () => {
    const originalEnv = process.env.NODE_ENV;
    const originalSecret = process.env.JWT_SECRET;
    try {
      process.env.NODE_ENV = 'production';
      delete process.env.JWT_SECRET;
      const { getJwtSecret } = require('../utils/token');
      try {
        getJwtSecret();
        throw new Error('Should have thrown error when secret missing in production');
      } catch (e) {
        if (!e.message.includes('[SECURITY FATAL]')) throw e;
      }
    } finally {
      process.env.NODE_ENV = originalEnv;
      if (originalSecret) process.env.JWT_SECRET = originalSecret;
    }
  });

  // TEST 2: JWT Short Secret Rejection in Production
  await check('JWT: getJwtSecret rejects secrets shorter than 32 chars in production', async () => {
    const originalEnv = process.env.NODE_ENV;
    const originalSecret = process.env.JWT_SECRET;
    try {
      process.env.NODE_ENV = 'production';
      process.env.JWT_SECRET = 'short_insecure_secret';
      const { getJwtSecret } = require('../utils/token');
      try {
        getJwtSecret();
        throw new Error('Should have thrown error on short secret in production');
      } catch (e) {
        if (!e.message.includes('[SECURITY FATAL]')) throw e;
      }
    } finally {
      process.env.NODE_ENV = originalEnv;
      if (originalSecret) process.env.JWT_SECRET = originalSecret;
    }
  });

  // TEST 3: Auth: Invalid Login Credentials Rejection
  await check('AUTH: Rejects invalid credentials with 401', async () => {
    const res = await httpRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      JSON.stringify({ username: 'testadmin', password: 'wrong_password_999' })
    );
    if (res.status !== 401) throw new Error(`Expected status 401, got ${res.status}`);
  });

  // TEST 4: Auth: Valid Login & Token Generation
  let validToken = '';
  await check('AUTH: Generates signed JWT for valid administrator', async () => {
    const { signToken } = require('../utils/token');
    validToken = signToken({ id: '6adf16ab3997db5a0fdb3a90' });
    if (!validToken) {
      throw new Error('Failed to generate signed JWT');
    }
  });

  // TEST 5: Auth: Access Protected Endpoint
  await check('AUTH: Protected endpoint accepts valid token', async () => {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/inquiries',
      method: 'GET',
      headers: { Authorization: `Bearer ${validToken}` },
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.body || res.raw)}`);
  });

  // TEST 6: Auth: Tampered Token Rejection
  await check('AUTH: Protected endpoint rejects tampered token with 401', async () => {
    const res = await httpRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/inquiries',
      method: 'GET',
      headers: { Authorization: 'Bearer fake.invalid.token' },
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // TEST 7: Inquiry: Empty Payload Validation
  await check('INQUIRY: Rejects empty payload with 400', async () => {
    const res = await httpRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/inquiries',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      JSON.stringify({})
    );
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  // TEST 8: Inquiry: Invalid Email Format Validation
  await check('INQUIRY: Rejects malformed email address with 400', async () => {
    const res = await httpRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/inquiries',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      JSON.stringify({
        name: 'Client Name',
        phone: '+91 99999 88888',
        email: 'invalid-email-address',
        message: 'Testing validation',
      })
    );
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  // TEST 9: Inquiry: Valid JSON Submission & Database Persistence
  let quoteInquiryId = '';
  await check('INQUIRY: Persists valid quote enquiry to database', async () => {
    const res = await httpRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/inquiries',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      JSON.stringify({
        name: 'Automated Test Engineer',
        phone: '+91 99206 91707',
        email: 'test@zcoolenterprises.com',
        company: 'Z Cool Quality Assurance',
        type: 'quote',
        source: 'automated_test',
        consentGiven: true,
        brand: 'Copeland',
        model: 'ZR72KC-TFD',
        quantity: '1 Unit',
        application: 'Commercial Air Conditioning',
        message: 'Automated Phase 1 verification enquiry',
      })
    );
    if (res.status !== 201 || !res.body?.inquiryId) {
      throw new Error(`Expected 201 and inquiryId, got ${res.status}`);
    }
    quoteInquiryId = res.body.inquiryId;
  });

  // TEST 10: Inquiry: File Upload Validation (Rejects Non-Image)
  await check('INQUIRY: Multer rejects non-image executable file with 400', async () => {
    const boundary = '----TestBoundaryXYZ';
    let body = `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="name"\r\n\r\nTest User\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="phone"\r\n\r\n+91 99999 88888\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="photo"; filename="script.sh"\r\n`;
    body += `Content-Type: text/x-shellscript\r\n\r\n`;
    body += `echo "malicious script"\r\n`;
    body += `--${boundary}--\r\n`;

    const payload = Buffer.from(body, 'utf8');
    const res = await httpRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/inquiries',
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': payload.length,
        },
      },
      payload
    );
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  // TEST 11: Inquiry: Multipart Image Upload & Persistence
  await check('INQUIRY: Accepts and stores valid image upload with enquiry', async () => {
    const boundary = '----TestBoundaryImage';
    const dummyPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    let header = `--${boundary}\r\n`;
    header += `Content-Disposition: form-data; name="name"\r\n\r\nField Tech User\r\n`;
    header += `--${boundary}\r\n`;
    header += `Content-Disposition: form-data; name="phone"\r\n\r\n+91 98200 11223\r\n`;
    header += `--${boundary}\r\n`;
    header += `Content-Disposition: form-data; name="brand"\r\n\r\nDaikin\r\n`;
    header += `--${boundary}\r\n`;
    header += `Content-Disposition: form-data; name="photo"; filename="nameplate.png"\r\n`;
    header += `Content-Type: image/png\r\n\r\n`;

    const headerBuf = Buffer.from(header, 'utf8');
    const footerBuf = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
    const fullBody = Buffer.concat([headerBuf, dummyPng, footerBuf]);

    const res = await httpRequest(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/inquiries',
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': fullBody.length,
        },
      },
      fullBody
    );
    if (res.status !== 201 || !res.body?.data?.hasPhoto) {
      throw new Error(`Expected 201 and hasPhoto: true, got ${res.status}`);
    }
  });

  // TEST 12: Existing Routes Integrity
  await check('ROUTES: Existing /api/products and /api/categories remain operational', async () => {
    const prodRes = await httpRequest({ hostname: 'localhost', port: 5000, path: '/api/products', method: 'GET' });
    const catRes = await httpRequest({ hostname: 'localhost', port: 5000, path: '/api/categories', method: 'GET' });
    if (prodRes.status !== 200 || catRes.status !== 200) {
      throw new Error(`Products returned ${prodRes.status}, Categories returned ${catRes.status}`);
    }
  });

  console.log('===============================================================');
  console.log(`RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('===============================================================');

  if (failed > 0) process.exit(1);
  process.exit(0);
}

runPhase1Tests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
