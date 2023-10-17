import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export async function accessSecretVersion(name: string): Promise<string> {

  const [version] = await client.accessSecretVersion({
    name: `projects/${process.env.NEXT_PUBLIC_FIREBASE_CONFIG_MESSAGING_SENDER_ID}/secrets/${name}/versions/latest`,
  });

  if (!version || !version.payload || !version.payload.data) {
    throw new Error(`Failed to retrieve secret ${name}`);
  }
  const payload :string = version.payload.data.toString();
    return payload;
}
