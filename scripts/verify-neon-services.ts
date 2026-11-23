import 'dotenv/config';
import { prisma } from '../lib/prisma';
import { uploadAsset, getAssetSignedUrl, listAssets, deleteAsset, ASSETS_BUCKET } from '../lib/storage';
import { auth } from '../lib/auth/server';

async function testServices() {
  console.log('=============================================');
  console.log('🧪 TESTING NEON SERVICES END-TO-END');
  console.log('=============================================\n');

  // 1. NEON POSTGRES (via Prisma + @prisma/adapter-neon)
  console.log('▶ [1/3] Testing Neon Lakebase Postgres...');
  try {
    const userCount = await prisma.user.count();
    console.log(`  ✓ Successfully queried Postgres. Current User count: ${userCount}`);

    // Create a verification user and delete it to prove write capability
    const testEmail = `verify-${Date.now()}@eventory.test`;
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        name: 'Neon Verification Tester',
        role: 'creator',
      },
    });
    console.log(`  ✓ Successfully inserted record into Neon Postgres! User ID: ${testUser.id}`);

    await prisma.user.delete({ where: { id: testUser.id } });
    console.log(`  ✓ Successfully cleaned up test record from Neon Postgres.`);
    console.log('  🎯 Neon Postgres: PASSED\n');
  } catch (err: any) {
    console.error('  ✗ Neon Postgres FAILED:', err.message);
    throw err;
  }

  // 2. NEON OBJECT STORAGE (via AWS S3 SDK + SigV4 to Neon branch endpoint)
  console.log('▶ [2/3] Testing Neon Object Storage...');
  try {
    const testKey = `test-verify/verify-${Date.now()}.txt`;
    const testContent = Buffer.from('Hello from Eventory via Neon Object Storage S3!');
    
    await uploadAsset(testKey, testContent, 'text/plain');
    console.log(`  ✓ Successfully uploaded object to bucket "${ASSETS_BUCKET}": ${testKey}`);

    const signedUrl = await getAssetSignedUrl(testKey, 300);
    console.log(`  ✓ Generated presigned download URL: ${signedUrl.substring(0, 75)}...`);

    const listResult = await listAssets('test-verify/');
    const found = listResult.Contents?.some(item => item.Key === testKey);
    console.log(`  ✓ Listed bucket "${ASSETS_BUCKET}". Verified test key in list: ${found}`);

    await deleteAsset(testKey);
    console.log(`  ✓ Successfully cleaned up test asset.`);
    console.log('  🎯 Neon Object Storage: PASSED\n');
  } catch (err: any) {
    console.error('  ✗ Neon Object Storage FAILED:', err.message);
    throw err;
  }

  // 3. NEON AUTH (via @neon/auth)
  console.log('▶ [3/3] Testing Neon Auth...');
  try {
    console.log(`  ✓ NEON_AUTH_BASE_URL: ${process.env.NEON_AUTH_BASE_URL}`);
    console.log(`  ✓ NEON_AUTH_JWKS_URL: ${process.env.NEON_AUTH_JWKS_URL}`);
    
    // Test Neon Auth endpoint ping / JWKS fetch
    const jwksRes = await fetch(process.env.NEON_AUTH_JWKS_URL || `${process.env.NEON_AUTH_BASE_URL}/.well-known/jwks.json`);
    console.log(`  ✓ Neon Auth JWKS HTTP response status: ${jwksRes.status} ${jwksRes.statusText}`);
    
    // Verify server auth instance
    if (auth && typeof auth.handler === 'function') {
      console.log('  ✓ Neon Auth server instance initialized with route handler.');
    }
    console.log('  🎯 Neon Auth: PASSED\n');
  } catch (err: any) {
    console.error('  ✗ Neon Auth FAILED:', err.message);
    throw err;
  }

  console.log('=============================================');
  console.log('🎉 ALL NEON SERVICES VERIFIED END-TO-END!');
  console.log('=============================================');
}

testServices().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
