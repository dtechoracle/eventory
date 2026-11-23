import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Ensure .env.local and .env are loaded and take precedence over ambient shell variables
const cwd = process.cwd();
const envLocalPath = path.resolve(cwd, '.env.local');
const envPath = path.resolve(cwd, '.env');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath, override: true });
}

import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function getConnectionString(): string {
  let url = process.env.DATABASE_URL;
  if (!url || url.startsWith('file:')) {
    if (process.env.DATABASE_URL_UNPOOLED) {
      url = process.env.DATABASE_URL_UNPOOLED;
    }
  }
  return (
    url ||
    'postgresql://neondb_owner:placeholder@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'
  );
}

function createPrismaClient(): PrismaClient {
  const connectionString = getConnectionString();
  const adapter = new PrismaNeon({ connectionString });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
