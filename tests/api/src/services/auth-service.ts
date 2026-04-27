import request from 'supertest';
import {PathService} from './path-service';
import {authBody} from '../factories/auth.factory';

export enum TestUsers {
  apiTesterAdmin = 'apitesteradmin@tests.com',
  apiTesterNotAdmin = 'apitesternotadmin@tests.com',
  apiTesterDeactivated = 'apitesterdeactivated@tests.com',
  apiTesterNotExisting = 'apitesternotexisting@tests.com',
}

export const testPassword = 'chocolate';
export const invalidAuthToken = {Authorization: 'Bearer invalidToken'};

class AuthService {
  async authorizeToken(
    email: string = TestUsers.apiTesterAdmin,
    password: string = testPassword,
  ): Promise<{Authorization: string}> {
    const response = await request(PathService.paths.auth).post('/').send(authBody({email, password}));
    return {
      Authorization: 'Bearer ' + response.body.token,
    };
  }
}

export const authService = new AuthService();
