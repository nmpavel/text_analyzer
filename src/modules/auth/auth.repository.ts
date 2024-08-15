import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    console.log('User before save:', user);
    return user.save();
  }

  async findUserByUserName(userName: string): Promise<User | null> {
    return this.userModel.findOne({ userName }).exec();
  }

  async updateEntity(id: string, data: UpdateUserDto): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteEntity(id: string): Promise<boolean> {
    const data = await this.userModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    ).exec();
    return !!data;
  }
}
