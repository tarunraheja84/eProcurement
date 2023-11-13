import { JWT } from 'google-auth-library';
import axios from 'axios';

const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const runtimeConfigApiUrl=(variable:string)=>{
  return `https://runtimeconfig.googleapis.com/v1beta1/projects/rb-services-386022/configs/e-procurement-app/variables/${variable}`;
}

const auth = new JWT({
  keyFile,
  scopes: ['https://www.googleapis.com/auth/cloudruntimeconfig'],
});

const fetchFromConfig = async (variable: string) => {
  try {
    await auth.authorize();

    const response = await axios.get(runtimeConfigApiUrl(variable), {
      headers: {
        'Authorization': `Bearer ${auth.credentials.access_token}`
      }
    });
    return response.data.text;
  } catch (error:any) {
    console.error('Error:', error.message);
  }
};

export default fetchFromConfig;

