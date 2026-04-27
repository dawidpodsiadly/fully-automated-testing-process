import {defaultConfig} from '../../config';
import {authApi} from '../api/auth/auth.api';

export class ApiTokenService {
  async getAuthToken() {
    const authToken = await authApi.getAuthToken(defaultConfig.userEmail, defaultConfig.userPassword);
    const bearerToken = 'Bearer ' + authToken;

    return bearerToken;
  }
}
export const apiTokenService = new ApiTokenService();
