import { JWT } from 'google-auth-library';
import axios from 'axios';

// Load the credentials from the GOOGLE_APPLICATION_CREDENTIALS file
const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const runtimeConfigApiUrl: string = 'https://runtimeconfig.googleapis.com/v1beta1/projects/rb-services-386022/configs/e-procurement-app/variables/TAX_RATES';

// Create a client instance to obtain an access token
const auth = new JWT({
  keyFile,
  scopes: ['https://www.googleapis.com/auth/cloudruntimeconfig'],
});

// Function to obtain an access token and make a request to the API
export const fetchTaxes = async () => {
  try {
    // Obtain an access token
    await auth.authorize();

    // Use the access token to make a request to the API
    const response = await axios.get(runtimeConfigApiUrl, {
      headers: {
        'Authorization': `Bearer ${auth.credentials.access_token}`
      }
    });
    return JSON.parse(response.data.text);
  } catch (error:any) {
    console.error('Error:', error.message);
  }
};

