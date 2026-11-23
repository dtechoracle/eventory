import { NextRequest, NextResponse } from 'next/server';
import { uploadAsset, getAssetSignedUrl } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split('.').pop() || 'bin';
    const key = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;

    await uploadAsset(key, buffer, file.type || 'application/octet-stream');
    const signedUrl = await getAssetSignedUrl(key);

    return NextResponse.json({
      success: true,
      key,
      url: signedUrl,
      size: file.size,
      contentType: file.type,
    });
  } catch (error: unknown) {
    console.error('Neon storage upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
