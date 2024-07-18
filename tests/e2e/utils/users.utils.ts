import { usersApi, UserData } from '../api/users-api';
import { randomUtil } from './random.utils';


export async function createUserByApi(isAdmin = true, isActivated = true) {
    const userData = this.generateRandomUserData(isAdmin, isActivated)
    return await usersApi.createUser(userData);
}

export async function generateRandomUserData(isAdmin = true, isActivated = true): Promise<UserData> {
    const startTime = randomUtil.randomDate();
    const endTime = randomUtil.randomOlderDate(startTime)

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
        age: randomUtil.randomInt(),
        notes: randomUtil.randomName(50),
        isAdmin,
        isActivated,
    }
}

export async function deleteUserByApi(userId: string) {
    return await usersApi.deleteUser(userId);
}