import {randomUtil} from '../utils/random.util';

export enum ContractType {
  Employment = 'Employment',
  B2B = 'B2B',
  Mandate = 'Mandate',
}

export enum Position {
  Storekeeper = 'Storekeeper',
  IT = 'IT',
  Accountant = 'Accountant',
}

export interface UserBody {
  name: string;
  surname: string;
  email: string;
  password: string;
  phoneNumber: string;
  birthDate: string;
  contract: {
    type: ContractType;
    salary: number;
    position: Position;
    startTime: string;
    endTime: string;
  };
  notes: string;
  isAdmin: boolean;
  isActivated: boolean;
}

export const userBody = (overrides: Partial<UserBody> = {}): UserBody => {
  const startTime = randomUtil.randomDate();
  const baseContract = {
    type: randomUtil.randomUserContractType(),
    salary: randomUtil.randomInt(),
    position: randomUtil.randomUserPosition(),
    startTime,
    endTime: randomUtil.randomOlderDate(startTime),
  };

  const baseBody: UserBody = {
    name: randomUtil.randomNameWithPrefix(),
    surname: randomUtil.randomNameWithPrefix(),
    email: randomUtil.randomEmail(),
    password: randomUtil.randomName(),
    phoneNumber: randomUtil.randomPhoneNumber(),
    birthDate: randomUtil.randomDate(),
    contract: baseContract,
    notes: randomUtil.randomName(50),
    isAdmin: true,
    isActivated: true,
  };

  return {
    ...baseBody,
    ...overrides,
  };
};
