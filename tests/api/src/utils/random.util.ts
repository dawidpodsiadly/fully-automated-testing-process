import {ContractType, Position} from '../factories/user.factory';
import {faker} from '@faker-js/faker';

export const bigLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const smallLetters = 'abcdefghijklmnopqrstuvwxyz';
export const letters = bigLetters + smallLetters;
export const digits = '0123456789';
export const alphanumeric = letters + digits;

export class RandomUtil {
  randomInt = (max: number = 10000000) => Math.floor(Math.random() * max);
  randomNameWithPrefix = () => 'api_' + this.randomInt().toString();

  randomChar(alphabet: string = alphanumeric) {
    return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }

  randomName(length = 10, alphabet = alphanumeric): string {
    let text = '';
    for (let i = 0; i < length; i++) {
      text += this.randomChar(alphabet);
    }
    return text;
  }

  randomStringNumber(length: number = this.randomInt()): string {
    let number = '';
    for (let i = 0; i < length; i++) {
      const randomDigit = Math.floor(Math.random() * 10);
      number += randomDigit.toString();
    }
    return number;
  }

  randomDate(): string {
    return faker.date.between({from: '1900-01-01', to: '2100-12-31'}).toISOString().split('T')[0];
  }

  randomOlderDate(startDate: string): string {
    const startDateObj = new Date(startDate);
    const endDate = new Date(startDateObj);
    endDate.setFullYear(startDateObj.getFullYear() + this.randomInt(25));
    return endDate.toISOString().split('T')[0];
  }

  randomPhoneNumber() {
    const minLength = 9;
    const maxLength = 14;
    const phoneLength = this.randomInt(maxLength - minLength + 1) + minLength;

    let phoneNumber = '';
    for (let i = 0; i < phoneLength; i++) {
      const randomDigit = Math.floor(Math.random() * 10);
      phoneNumber += randomDigit.toString();
    }
    return phoneNumber;
  }

  randomEmail() {
    return `api_${this.randomName(10, smallLetters)}@api.pl`;
  }

  randomUserContractType(): ContractType {
    const contractTypes = Object.values(ContractType);
    const randomIndex = this.randomInt(contractTypes.length);
    return contractTypes[randomIndex];
  }

  randomUserPosition(): Position {
    const positions = Object.values(Position);
    const randomIndex = this.randomInt(positions.length);
    return positions[randomIndex];
  }
}
export const randomUtil = new RandomUtil();
