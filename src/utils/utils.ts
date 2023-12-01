import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { getServerSession } from 'next-auth';
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


export async function getUserEmail() {
  const session = await getServerSession();
  if (!session) {
    return null;
  }
  return session?.user?.email;
}

export async function getUserName() {
  const session = await getServerSession();
  if (!session) {
    return null;
  }
  return session?.user?.name;
}

export const deliveryAddress = {
  addressLine1 : "Plot No 2, Landmark Tower, 4th Floor 113",
  addressLine2 : "Ashok Marg, opp. C, South City I",
  city : "Gurugram",
  state : "Haryana",
  pincode : "122001"
}

export const companyHostedDomain = {
  domain : "redbasil.in"
}
