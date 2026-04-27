import {randomUtil} from '../utils/random.util';

export interface AuthBody {
  email: string;
  password: string;
}

export const authBody = (overrides: Partial<AuthBody> = {}): AuthBody => {
  const baseBody: AuthBody = {
    email: randomUtil.randomEmail(),
    password: randomUtil.randomName(),
  };

  return {
    ...baseBody,
    ...overrides,
  };
};
