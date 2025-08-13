import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { IUser } from './interfaces/user.interface';
import { User } from './schemas/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<IUser>,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...result } = user.toObject();
    return result;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
    const payload = { email: user.email, sub: user._id, role: user.role };
    
    const jwtSecret = this.configService.get<string>('jwtSecret');
    if (!jwtSecret) {
      throw new Error('JWT secret is not configured');
    }

    return {
      access_token: jwt.sign(payload, jwtSecret, {
        expiresIn: this.configService.get('jwtExpiresIn'),
      }),
    };
  }

  async findAll(): Promise<IUser[]> {
    return this.userModel.find().exec();
  }
}