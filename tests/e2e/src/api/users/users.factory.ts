import {randomUtil} from '../../utils/random.utils';
import {ApiUserData} from './users.api';

export function generateRandomApiUserData(isAdmin = true, isActivated = true): ApiUserData {
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
      salary: randomUtil.randomInt(),
      position: randomUtil.randomUserPosition(),
      startTime,
      endTime,
    },
    notes: randomUtil.randomName(50),
    isAdmin,
    isActivated,
  };
}
