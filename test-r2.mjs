import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';

// Manual env parsing
const envText = readFileSync('apps/fonoteca-admin/.env.local', 'utf-8');
const env = {};
envText.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    env[key] = value;
  }
});

const accountId = env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKey = env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretKey = env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucket = env.CLOUDFLARE_R2_BUCKET_NAME;

console.log("Account ID:", accountId);
console.log("Bucket Name:", bucket);

const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: accessKey || '',
        secretAccessKey: secretKey || ''
    }
});

try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: 'test-antigravity.txt',
      Body: 'Hello World from Antigravity',
      ContentType: 'text/plain',
    });
    const result = await r2Client.send(command);
    console.log("Upload Success!");
} catch (err) {
    console.error("Upload Failed:", err);
}
