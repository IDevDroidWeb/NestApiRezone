import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { configuration } from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PaymentModule } from './payments/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/myfatoorah'),
    AuthModule,
    UsersModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}