import {UserData} from '../types/user.types';
import {randomUtil} from '../utils/random.utils';

export function generateRandomUserData(isAdmin = true, isActivated = true): UserData {
  const startTime = randomUtil.randomDate();
  const endTime = randomUtil.randomYoungerDate(startTime);

  return {
    name: randomUtil.randomName(),
    surname: randomUtil.randomName(),
    email: randomUtil.randomEmail(),
    password: randomUtil.randomName(9),
    phoneNumber: randomUtil.randomPhoneNumber(),
    birthDate: randomUtil.randomDate(),
    contract: {
      type: randomUtil.randomUserContractType(),
      salary: randomUtil.randomInt().toString(),
      position: randomUtil.randomUserPosition(),
      startTime,
      endTime,
    },
    notes: randomUtil.randomName(50),
    isAdmin,
    isActivated,
  };
}
