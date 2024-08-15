import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Text } from './schema/Text.schema';
import { TextRepository } from './Text.repository'; 
import { CreateTextDto } from './dto/create-Text.dto';
import { UpdateTextDto } from './dto/update-Text.dto';
import { Constants } from 'src/utils/constants';
import { ResponseUtils } from 'src/utils/response.utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Logger } from 'nestjs-pino';

@Injectable()
export class TextService {
  constructor(
    @InjectModel('Text') private readonly TextModel: Model<Text>, 
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly logger: Logger
  ) {}

  private readonly TextRepository = new TextRepository(this.TextModel);

  async create(dto: CreateTextDto): Promise<Text> {
    this.logger.verbose('Creating new text entry');
    
    const data = await this.TextRepository.createEntity(dto);
    if (!data) {
      this.logger.error('Text creation failed');
      throw new BadRequestException(Constants.CREATE_FAILED);
    }

    this.logger.log('Text successfully created');
    return ResponseUtils.successResponseHandler(201, 'Successfully created content.', 'data', data);
  }

  async findAll(): Promise<Text[]> {
    this.logger.verbose('Fetching all text entries');
    
    const data = await this.TextRepository.findAll();
    if (!data) {
      this.logger.warn('No text entries found');
      throw new NotFoundException(Constants.NOT_FOUND);
    }

    this.logger.log('Text entries successfully fetched');
    return ResponseUtils.successResponseHandler(200, 'Data fetched successfully', 'data', data);
  }

  async findOne(id: string): Promise<Text | null> {
    this.logger.debug(`Fetching text entry with ID: ${id}`);
    
    const data = await this.TextRepository.findOneEntity(id);
    if (!data) {
      this.logger.warn(`Text entry with ID ${id} not found`);
      throw new NotFoundException(Constants.NOT_FOUND);
    }

    this.logger.log('Text entry successfully fetched');
    return ResponseUtils.successResponseHandler(200, 'Data fetched successfully', 'data', data);
  }

  async update(id: string, dto: UpdateTextDto): Promise<Text | null> {
    this.logger.verbose(`Updating text entry with ID: ${id}`);
    
    const res = await this.TextRepository.findOneEntity(id);
    if (!res) {
      this.logger.warn(`Text entry with ID ${id} not found for update`);
      throw new NotFoundException(Constants.NOT_FOUND);
    }

    const data = await this.TextRepository.updateEntity(id, dto);
    if (!data) {
      this.logger.error(`Failed to update text entry with ID ${id}`);
      throw new BadRequestException(Constants.UPDATE_FAILED);
    }

    this.logger.log(`Text entry with ID ${id} updated successfully`);
    return ResponseUtils.successResponseHandler(200, 'Data updated successfully', 'data', data);
  }

  async delete(id: string): Promise<void> {
    this.logger.debug(`Deleting text entry with ID: ${id}`);
    
    const res = await this.TextRepository.findOneEntity(id);
    if (!res) {
      this.logger.warn(`Text entry with ID ${id} not found for deletion`);
      throw new NotFoundException(Constants.NOT_FOUND);
    }
    
    const data = await this.TextRepository.deleteEntity(id);
    if (!data) {
      this.logger.error(`Failed to delete text entry with ID ${id}`);
      throw new BadRequestException(Constants.DELETE_FAILED);
    }

    this.logger.log(`Text entry with ID ${id} deleted successfully`);
    return ResponseUtils.buildDeletedData(data, 200, 'Data deleted successfully');
  }

  async getWordCount(content: string): Promise<any> {
    this.logger.verbose('Calculating word count');
    
    const cacheKey = `wordCount:${content}`;
    const cachedResult = await this.cacheManager.get<number>(cacheKey);
  
    if (cachedResult !== undefined) {
      this.logger.debug('Word count retrieved from cache');
      return ResponseUtils.successResponseHandler(200, 'Word count retrieved from cache', 'data', cachedResult);
    }
  
    const wordCount = content?.split(/\s+/).filter(Boolean).length;
    await this.cacheManager.set(cacheKey, wordCount, 3600);
    this.logger.log('Word count calculated successfully');
    
    return ResponseUtils.successResponseHandler(200, 'Word count calculated', 'data', wordCount);
  }

  async getCharacterCount(content: string): Promise<any> {
    this.logger.verbose('Calculating character count');
    
    const cacheKey = `charCount:${content}`;
    const cachedResult = await this.cacheManager.get<number>(cacheKey);
  
    if (cachedResult !== undefined) {
      this.logger.debug('Character count retrieved from cache');
      return ResponseUtils.successResponseHandler(200, 'Character count retrieved from cache', 'data', cachedResult);
    }

    const charCount = content?.replace(/\s+/g, '').length;
    await this.cacheManager.set(cacheKey, charCount, 3600);
    this.logger.log('Character count calculated successfully');
    
    return ResponseUtils.successResponseHandler(200, 'Character count calculated', 'data', charCount);
  }

  async getSentenceCount(content: string): Promise<any> {
    this.logger.verbose('Calculating sentence count');
    
    const cacheKey = `sentCount:${content}`;
    const cachedResult = await this.cacheManager.get<number>(cacheKey);
  
    if (cachedResult !== undefined) {
      this.logger.debug('Sentence count retrieved from cache');
      return ResponseUtils.successResponseHandler(200, 'Sentence count retrieved from cache', 'data', cachedResult);
    }

    const sentCount = content?.split(/[.!?]+/).filter(Boolean).length;
    await this.cacheManager.set(cacheKey, sentCount, 3600);
    this.logger.log('Sentence count calculated successfully');
    
    return ResponseUtils.successResponseHandler(200, 'Sentence count calculated', 'data', sentCount);
  }

  async getParagraphCount(content: string): Promise<any> {
    this.logger.verbose('Calculating paragraph count');
    
    const cacheKey = `parCount:${content}`;
    const cachedResult = await this.cacheManager.get<number>(cacheKey);
  
    if (cachedResult !== undefined) {
      this.logger.debug('Paragraph count retrieved from cache');
      return ResponseUtils.successResponseHandler(200, 'Paragraph count retrieved from cache', 'data', cachedResult);
    }

    const parCount = content?.split(/\n+/).filter(Boolean).length;
    await this.cacheManager.set(cacheKey, parCount, 3600);
    this.logger.log('Paragraph count calculated successfully');
    
    return ResponseUtils.successResponseHandler(200, 'Paragraph count calculated', 'data', parCount);
  }

  async getLongestWord(content: string): Promise<any> {
    this.logger.verbose('Finding longest word');
    
    const cacheKey = `longestWord:${content}`;
    const cachedResult = await this.cacheManager.get<string>(cacheKey);
  
    if (cachedResult !== undefined) {
      this.logger.debug('Longest word retrieved from cache');
      return ResponseUtils.successResponseHandler(200, 'Longest word retrieved from cache', 'data', cachedResult);
    }

    const longestWord = content?.split(/\s+/).reduce((longest, current) => current.length > longest.length ? current : longest, '');
    await this.cacheManager.set(cacheKey, longestWord, 3600);
    this.logger.log('Longest word found successfully');
    
    return ResponseUtils.successResponseHandler(200, 'Longest word found', 'data', longestWord);
  }
}
