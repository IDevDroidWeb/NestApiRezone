import { registerAs } from '@nestjs/config';

// Define interfaces with 'export type' for isolatedModules
export type JwtConfig = {
  secret: string;
  expiresIn: string;
};

export type MongoConfig = {
  uri: string;
};

export type MyFatoorahConfig = {
  apiKey: string;
  baseUrl: string;
};

export type AppConfig = {
  environment: string;
  port: number;
  apiVersion: string;
  jwt: JwtConfig;
  mongo: MongoConfig;
  myfatoorah: MyFatoorahConfig;
  app: {
    baseUrl: string;
  };
};

// Default export remains the same
export default registerAs('config', (): AppConfig => ({
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT as string, 10) || 3000,
  apiVersion: process.env.API_VERSION || 'v1',
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN as string,
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