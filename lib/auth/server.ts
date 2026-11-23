import { createNeonAuth } from '@neon/auth/next/server';

const cookieSecret =
  process.env.NEON_AUTH_COOKIE_SECRET ||
  'bCrtEFlhOCjCCe5vGuCBu0E43UYnbMDtAQSVfriNFDU=';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL || 'https://auth.neon.tech',
  cookies: { secret: cookieSecret },
});

export default auth;
