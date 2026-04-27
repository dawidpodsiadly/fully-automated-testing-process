import request from 'supertest';
import {PathService} from '../services/path-service';
import {authBody} from '../factories/auth.factory';
import {TestUsers, authService, testPassword, invalidAuthToken} from '../services/auth-service';
import {cleanupService} from '../services/cleanup-service';

const baseUrl = PathService.paths.auth;
let adminAuthToken: {Authorization: string};

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    adminAuthToken = await authService.authorizeToken();
  });
  describe('GET /auth', () => {
    it('Should return 401 when Invalid Token - GET /auth', async () => {
      const response = await request(baseUrl).get('/').set(invalidAuthToken);
      expect(response.body.message).toContain('Invalid token');
      expect(response.statusCode).toEqual(401);
    });

    it('Should return 200 and Token when Valid Token - GET /auth', async () => {
      const response = await request(baseUrl).get('/').set(adminAuthToken);
      expect(response.body.message).toContain('Valid token');
      expect(response.statusCode).toEqual(200);
    });

    it('Should return 401 when Token Not Provided - GET /auth', async () => {
      const response = await request(baseUrl).get('/').set('Authorization', '');
      expect(response.body.message).toContain('Token not provided or is wrong');
      expect(response.statusCode).toEqual(401);
    });

    it('Should return 500 when Authorization Header is Missing - GET /auth', async () => {
      const response = await request(baseUrl).get('/');
      expect(response.statusCode).toEqual(500);
      expect(response.body.message).toContain("Cannot read properties of undefined (reading 'split')");
    });
    afterAll(async () => {
      await cleanupService.performFullCleanup();
    });
  });

  describe('POST /auth', () => {
    it('Should return 401 when Invalid Credentials - POST /auth', async () => {
      const response = await request(baseUrl)
        .post('/')
        .send(
          authBody({
            email: TestUsers.apiTesterNotExisting,
            password: testPassword,
          }),
        );
      expect(response.body.message).toContain('Invalid email or password');
      expect(response.statusCode).toEqual(401);
    });

    it('Should return 200 and Token when Valid Credentials - POST /auth', async () => {
      const response = await request(baseUrl)
        .post('/')
        .send(
          authBody({
            email: TestUsers.apiTesterAdmin,
            password: testPassword,
          }),
        );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('Should return 401 when Valid Email and Invalid Password - POST /auth', async () => {
      const response = await request(baseUrl)
        .post('/')
        .send(
          authBody({
            email: TestUsers.apiTesterAdmin,
            password: `${testPassword}_invalid`,
          }),
        );
      expect(response.body.message).toContain('Invalid email or password');
      expect(response.statusCode).toEqual(401);
    });

    it('Should return 401 when no Auth  - POST /auth', async () => {
      const response = await request(baseUrl).post('/');
      expect(response.body.message).toContain('Invalid email or password');
      expect(response.status).toBe(401);
    });

    it('Should return 403 when User is Deactivated - POST /auth', async () => {
      const response = await request(baseUrl)
        .post('/')
        .send(
          authBody({
            email: TestUsers.apiTesterDeactivated,
            password: testPassword,
          }),
        );
      expect(response.body.message).toBe('Account is not activated');
      expect(response.status).toBe(403);
    });
  });
  afterAll(async () => {
    await cleanupService.performFullCleanup();
  });
});
