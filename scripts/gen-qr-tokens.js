// scripts/gen-qr-tokens.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

const secret = process.env.QR_TOKEN_SECRET;
if (!secret) {
  console.error('Missing QR_TOKEN_SECRET in .env');
  process.exit(1);
}

// Sửa id theo DB thực tế của bạn:
const pairs = [
  { id: 1, code: 'DB001' },
  { id: 2, code: 'DB002' },
  { id: 3, code: 'DB003' },
  { id: 4, code: 'DB004' },
  { id: 5, code: 'DB005' },
  { id: 6, code: 'DB006' },
  { id: 7, code: 'DB007' },
  { id: 8, code: 'DB008' },
  { id: 9, code: 'DB009' },
  { id: 10, code: 'DB010' },
];

pairs.forEach(({ id, code }) => {
  const token = jwt.sign(
    { typ: 'qr-checkin', delegateInfoId: id, eventId: 1, sub: id },
    secret,
    { algorithm: 'HS256', expiresIn: process.env.QR_TOKEN_EXPIRATION_TIME || '30d' }
  );
  console.log(`${code}\n${token}\n`);
});
