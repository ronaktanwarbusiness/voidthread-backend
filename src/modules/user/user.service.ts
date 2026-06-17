import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/database/schemas/user.schema';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private user_model: Model<UserDocument>,
  ) {}
  async getUserById(id: string) {
    try {
      const user = await this.user_model.findById(id).lean();
      return user;
    } catch (err) {
      console.log('Error:', err);
      return null;
    }
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.user_model
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User updated successfully',
      user,
    };
  }
}
