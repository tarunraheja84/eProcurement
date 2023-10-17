import { GoogleAuth } from 'google-auth-library';

const _googleAuth =
    process.env.NODE_ENV !== "production"
        ? new GoogleAuth({ keyFilename: process.env.NEXT_PUBLIC_APPLICATION_CREDENTIALS })
        : new GoogleAuth();

export const getHeaders = async (baseUrl: string) => {
    try {
        const client = await _googleAuth.getIdTokenClient(`${baseUrl}`);
        return await client.getRequestHeaders(`${baseUrl}`);
    } catch (e) {
        throw new Error(`Error While fetching ${baseUrl} : ` + e);
    }
}

import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
const client = new SecretManagerServiceClient();

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT;
export const accessSecret = async (name: string) => {
    const [version] = await client.accessSecretVersion({
        name: `projects/${PROJECT_ID}/secrets/${name}/versions/latest`,
    });
    if (!version || !version.payload || !version.payload.data) {
        throw new Error(`Failed to retrieve secret ${name}`);
    }
    const payload = version.payload.data.toString();
    return payload;
}

import { getServerSession } from 'next-auth';

export async function getUserEmail() {
  const session = await getServerSession();
  if (!session) {
    return null;
  }
  return session?.user?.email;
}
