import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { JwtService } from '@nestjs/jwt';

import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { User, UserDocument } from 'src/database/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    private jwtService: JwtService,
  ) {}

  async register(body: any) {
    const existingUser = await this.userModel.findOne({
      email: body.email,
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await this.userModel.create({
      ...body,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({
      user_id: user._id,
      email: user.email,
    });

    const userObject = user.toObject();

    // delete userObject?.password;

    return {
      message: 'Register successful',
      token,
      user: userObject,
    };
  }

  async login(body: any) {
    const user = await this.userModel.findOne({
      email: body.email,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatched = await bcrypt.compare(
      body.password,
      user.password,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      user_id: user._id,
      email: user.email,
    });

    const userObject = user.toObject();

    // delete userObject?.password;

    return {
      message: 'Login successful',
      token,
      user: userObject,
    };
  }
}
