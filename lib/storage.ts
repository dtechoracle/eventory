import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const s3 = new S3Client({
  forcePathStyle: true, // required: Neon uses path-style addressing
  region: process.env.AWS_REGION || 'us-east-2',
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const ASSETS_BUCKET = 'assets';

/**
 * Upload an asset buffer/string to Neon Object Storage
 */
export async function uploadAsset(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType: string = 'application/octet-stream'
) {
  const command = new PutObjectCommand({
    Bucket: ASSETS_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  return s3.send(command);
}

/**
 * Get a presigned download URL for an object in Neon Object Storage
 */
export async function getAssetSignedUrl(key: string, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: ASSETS_BUCKET,
    Key: key,
  });
  return getSignedUrl(s3, command, { expiresIn });
}

/**
 * Delete an asset from Neon Object Storage
 */
export async function deleteAsset(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: ASSETS_BUCKET,
    Key: key,
  });
  return s3.send(command);
}

/**
 * List objects in the Neon assets bucket
 */
export async function listAssets(prefix?: string) {
  const command = new ListObjectsV2Command({
    Bucket: ASSETS_BUCKET,
    Prefix: prefix,
  });
  return s3.send(command);
}
