export enum UserContractPosition {
  Storekeeper = 'Storekeeper',
  Accountant = 'Accountant',
  IT = 'IT',
}

export enum UserContractType {
  Employment = 'Employment',
  Mandate = 'Mandate',
  B2B = 'B2B',
}

export interface UserData {
  name: string;
  surname: string;
  email: string;
  password: string;
  phoneNumber?: string;
  birthDate?: string;
  contract?: {
    type?: UserContractType;
    salary?: string;
    position?: UserContractPosition;
    startTime?: string;
    endTime?: string;
  };
  notes?: string;
  isAdmin?: boolean;
  isActivated?: boolean;
}
