import { registerAs } from '@nestjs/config';

// Define the interface first
export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface MongoConfig {
  uri: string;
}

export interface MyFatoorahConfig {
  apiKey: string;
  baseUrl: string;
}

export interface AppConfig {
  environment: string;
  port: number;
  apiVersion: string;
  jwt: JwtConfig;
  mongo: MongoConfig;
  myfatoorah: MyFatoorahConfig;
  app: {
    baseUrl: string;
  };
}

// Export the configuration as default
export default registerAs('config', (): AppConfig => ({
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT as string, 10) || 3000,
  apiVersion: process.env.API_VERSION || 'v1',
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
  },
  mongo: {
    uri: process.env.MONGO_URI as string,
  },
  myfatoorah: {
    apiKey: process.env.MYFATOORAH_API_KEY as string,
    baseUrl: process.env.MYFATOORAH_BASE_URL as string,
  },
  app: {
    baseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
  },
}));