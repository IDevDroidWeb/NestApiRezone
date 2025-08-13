import { registerAs } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

interface MongoConfig {
  uri: string;
}

interface MyFatoorahConfig {
  apiKey: string;
  baseUrl: string;
}

interface AppConfig {
  jwt: JwtConfig;
  mongo: MongoConfig;
  myfatoorah: MyFatoorahConfig;
  app: {
    baseUrl: string;
  };
}

export default registerAs('config', (): AppConfig => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
  },
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/myfatoorah',
  },
  myfatoorah: {
    apiKey: process.env.MYFATOORAH_API_KEY || '',
    baseUrl: process.env.MYFATOORAH_BASE_URL || '',
  },
  app: {
    baseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
  },
}));