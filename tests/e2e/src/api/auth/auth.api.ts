import axios from 'axios';
import {defaultConfig} from '../../../config';

class AuthApi {
  private baseUrl = defaultConfig.baseUrl + '/api/auth';

  async getAuthToken(email: string, password: string) {
    try {
      const response = await axios.post(this.baseUrl, {email, password});
      return response.data.token;
    } catch (error) {
      throw new Error(`Failed to Get Auth Token: ${error}`);
    }
  }
}

export const authApi = new AuthApi();
