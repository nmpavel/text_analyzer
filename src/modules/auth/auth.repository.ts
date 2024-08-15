import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly logger: Logger, 
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    this.logger.verbose('Creating a new user', createUserDto);
    
    const user = new this.userModel(createUserDto);
    
    try {
      const result = await user.save();
      this.logger.debug('User created successfully', result);
      return result;
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw error;
    }
  }

  async findUserByUserName(userName: string): Promise<User | null> {
    this.logger.verbose(`Finding user by userName: ${userName}`);
    
    try {
      const user = await this.userModel.findOne({ userName }).exec();
      if (user) {
        this.logger.debug('User found', user);
      } else {
        this.logger.debug(`No user found with userName: ${userName}`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Error while finding user with userName: ${userName}`, error);
      throw error;
    }
  }

  async updateEntity(id: string, data: UpdateUserDto): Promise<User | null> {
    this.logger.verbose(`Updating user entity with id: ${id}`, data);
    
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
      if (updatedUser) {
        this.logger.debug('User entity updated successfully', updatedUser);
      } else {
        this.logger.debug(`Failed to update user entity. Not found: ${id}`);
      }
      return updatedUser;
    } catch (error) {
      this.logger.error(`Failed to update user entity with id: ${id}`, error);
      throw error;
    }
  }

  async deleteEntity(id: string): Promise<boolean> {
    this.logger.verbose(`Marking user entity as deleted with id: ${id}`);
    
    try {
      const data = await this.userModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
      ).exec();
      
      if (data) {
        this.logger.debug(`User entity marked as deleted: ${id}`);
        return true;
      } else {
        this.logger.debug(`Failed to mark user entity as deleted. Not found: ${id}`);
        return false;
      }
    } catch (error) {
      this.logger.error(`Failed to delete user entity with id: ${id}`, error);
      throw error;
    }
  }
}
