import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export interface User {
  email: string;
  password: string;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const users: { admin: User; standard: User } = {
  admin: {
    email: requiredEnv('ADMIN_EMAIL'),
    password: requiredEnv('ADMIN_PASSWORD'),
  },
  standard: {
    email: requiredEnv('STANDARD_EMAIL'),
    password: requiredEnv('STANDARD_PASSWORD'),
  },
};
