import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/database/schemas/user.schema';

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
}
