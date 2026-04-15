import rawUsers from './users.json';

export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserFixtureData {
  validUser: UserCredentials;
  lockedUser: UserCredentials;
  invalidUser: UserCredentials;
}

export const users = rawUsers as UserFixtureData;
