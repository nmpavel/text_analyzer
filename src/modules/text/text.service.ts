import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Text } from './schema/Text.schema';
import { TextRepository } from './Text.repository'; 
import { CreateTextDto } from './dto/create-Text.dto';
import { UpdateTextDto } from './dto/update-Text.dto';
import { ResponseUtils } from 'src/utils/response.utils';
import { Constants } from 'src/utils/constants';

@Injectable()
export class TextService {
  constructor(@InjectModel('Text') private readonly TextModel: Model<Text>) { }

  private readonly TextRepository = new TextRepository(this.TextModel);

  async create(dto: CreateTextDto): Promise<Text> {
    const data = await this.TextRepository.createEntity(dto);
    if (!data) {
      throw new BadRequestException(
        Constants.CREATE_FAILED,
      );
    }
    return ResponseUtils.successResponseHandler(201, "Successfully created Content.", "data", data);
  }

  async findAll(): Promise<Text[]> {
    const data = await this.TextRepository.findAll();
    if (!data) {
      throw new NotFoundException(
        Constants.NOT_FOUND,
      );
    }
    return ResponseUtils.successResponseHandler(200, "Data fetched successfully", "data", data);
  }

  async findOne(id: string): Promise<Text | null> {
    const data = await this.TextRepository.findOneEntity(id);
    if (!data) {
      throw new NotFoundException(
        Constants.NOT_FOUND,
      );
    }
    return ResponseUtils.successResponseHandler(200, "Data fetched successfully", "data", data);
  }

  async update(id: string, dto: UpdateTextDto): Promise<Text | null> {
    const res = await this.TextRepository.findOneEntity(id);
    if (!res) {
      throw new NotFoundException(
        Constants.NOT_FOUND,
      );
    }
    const data = await this.TextRepository.updateEntity(id, dto);
    if (!data) {
      throw new BadRequestException(
        Constants.UPDATE_FAILED,
      );
    }
    return ResponseUtils.successResponseHandler(200, "Data updated successfully", "data", data);
  }

  async delete(id: string): Promise<void> {
    const res = await this.TextRepository.findOneEntity(id);
    if (!res) {
      throw new NotFoundException(
        Constants.NOT_FOUND,
      );
    }
    
    const data = await this.TextRepository.deleteEntity(id);
    if (!data) {
      throw new BadRequestException(
        Constants.DELETE_FAILED,
      );
    }
    return ResponseUtils.buildDeletedData(data, 200, "Data deleted successfully");
  }
  async getWordCount(content: string): Promise<any> {
    const wordCount = content?.split(/\s+/).filter(Boolean).length;
    return ResponseUtils.successResponseHandler(200, "Word count calculated", 'wordCount' , wordCount );
}


  async getCharacterCount(content: string): Promise<number> {
    const charCount = content?.replace(/\s+/g, '').length;
    return ResponseUtils.successResponseHandler(200, "Character count calculated", "charCount", charCount);
  }

  async getSentenceCount(content: string): Promise<number> {
    const sentCount = content?.split(/[.!?]+/).filter(Boolean).length;
    return ResponseUtils.successResponseHandler(200, "Sentence count calculated", "sentCount", sentCount);
  }

  async getParagraphCount(content: string): Promise<number> {
    const parCount = content?.split(/\n+/).filter(Boolean).length;
    return ResponseUtils.successResponseHandler(200, "Paragaraph count calculated", "parCount", parCount);
  }

  async getLongestWord(content: string): Promise<string> {
    const longestWord = content?.split(/\s+/).reduce((longest, current) => current.length > longest.length ? current : longest, '');
    return ResponseUtils.successResponseHandler(200, "Longest word found", "longestWord", longestWord);
  }
}