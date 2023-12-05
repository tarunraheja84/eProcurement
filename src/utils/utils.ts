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

export const companyHostedDomain = {
  domain : "redbasil.in"
}

export const sellerDetails = {
  sellerBusinessName:'Red Basil Technologies Private Limited',
  sellerBusinessAddress:'4th Floor, Landmark Tower, Plot No. 2, Ashok Marg, South City-1, Opposite C-113, South City-1, Gurugram, Gurugram, Haryana, 122001',
  sellerPhoneNo:'+919821214134',
  sellerBizBrandName:'Flavr Foods',
  sellerGSTIN:'06AAKCR7582F1Z0',
  sellerPAN:'AAKCR7582F',
}



