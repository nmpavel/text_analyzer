// import { Test, TestingModule } from '@nestjs/testing';
// import { TextService } from './Text.service';
// import { getModelToken } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { Text } from './schema/Text.schema';
// import { CreateTextDto } from './dto/create-Text.dto';
// import { UpdateTextDto } from './dto/update-Text.dto';
// import { TextRepository } from './Text.repository';
// import { NotFoundException, BadRequestException } from '@nestjs/common';
// import { ResponseUtils } from '@utils/response.utils';
// import { Constants } from '@utils/constants';

// describe('TextService', () => {
//     let service: TextService;
//     let textRepository: TextRepository<Text>;

//     const mockTextRepository = {
//         createEntity: jest.fn(),
//         findOneEntity: jest.fn(),
//         updateEntity: jest.fn(),
//         deleteEntity: jest.fn(),
//         findAll: jest.fn(),
//     };

//     const mockResponseUtils = {
//         successResponseHandler: jest.fn(),
//         buildDeletedData: jest.fn(),
//     };

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             providers: [
//                 TextService,
//                 {
//                     provide: getModelToken('Text'),
//                     useValue: {},
//                 },
//                 {
//                     provide: TextRepository,
//                     useValue: mockTextRepository,
//                 },
//                 {
//                     provide: ResponseUtils,
//                     useValue: mockResponseUtils,
//                 },
//             ],
//         }).compile();

//         service = module.get<TextService>(TextService);
//         textRepository = module.get<TextRepository<Text>>(TextRepository);
//         ResponseUtils.successResponseHandler = mockResponseUtils.successResponseHandler;
//         ResponseUtils.buildDeletedData = mockResponseUtils.buildDeletedData;
//     });

//     it('should be defined', () => {
//         expect(service).toBeDefined();
//     });

//     describe('create', () => {
//         it('should successfully create a text entity', async () => {
//             const createDto: CreateTextDto = { content: 'Lorem ipsum' };
//             const createdText = { _id: new Types.ObjectId(), content: createDto.content, isDeleted: false };
//             mockTextRepository.createEntity.mockResolvedValue(createdText);
//             mockResponseUtils.successResponseHandler.mockReturnValue(createdText);

//             expect(await service.create(createDto)).toEqual(createdText);
//         });
//     });

//     describe('findAll', () => {
//         it('should return all text entities', async () => {
//             const texts = [{ _id: new Types.ObjectId(), content: 'Lorem ipsum', isDeleted: false }];
//             mockTextRepository.findAll.mockResolvedValue(texts);
//             mockResponseUtils.successResponseHandler.mockReturnValue(texts);

//             expect(await service.findAll()).toEqual(texts);
//         });
//     });

//     describe('findOne', () => {
//         it('should return a single text entity by ID', async () => {
//             const text = { _id: new Types.ObjectId(), content: 'Lorem ipsum', isDeleted: false };
//             const id = text._id.toString();
//             mockTextRepository.findOneEntity.mockResolvedValue(text);
//             mockResponseUtils.successResponseHandler.mockReturnValue(text);

//             expect(await service.findOne(id)).toEqual(text);
//         });

//         it('should throw NotFoundException if no text found', async () => {
//             const id = new Types.ObjectId().toString();
//             mockTextRepository.findOneEntity.mockResolvedValue(null);

//             await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
//         });
//     });

//     describe('update', () => {
//         it('should update a text entity by ID', async () => {
//             const updateDto: UpdateTextDto = { content: 'Updated content' };
//             const updatedText = { _id: new Types.ObjectId(), content: updateDto.content, isDeleted: false };
//             const id = updatedText._id.toString();
//             mockTextRepository.findOneEntity.mockResolvedValue(updatedText);
//             mockTextRepository.updateEntity.mockResolvedValue(updatedText);
//             mockResponseUtils.successResponseHandler.mockReturnValue(updatedText);

//             expect(await service.update(id, updateDto)).toEqual(updatedText);
//         });

//         it('should throw NotFoundException if text to update is not found', async () => {
//             const updateDto: UpdateTextDto = { content: 'Updated content' };
//             const id = new Types.ObjectId().toString();
//             mockTextRepository.findOneEntity.mockResolvedValue(null);

//             await expect(service.update(id, updateDto)).rejects.toThrow(NotFoundException);
//         });
//     });

//     describe('delete', () => {
//         it('should delete a text entity by ID', async () => {
//             const id = new Types.ObjectId().toString();
//             mockTextRepository.findOneEntity.mockResolvedValue({ _id: id, isDeleted: false });
//             mockTextRepository.deleteEntity.mockResolvedValue(true);
//             mockResponseUtils.buildDeletedData.mockReturnValue({ message: 'Data deleted successfully' });

//             await expect(service.delete(id)).resolves.not.toThrow();
//         });

//         it('should throw NotFoundException if text to delete is not found', async () => {
//             const id = new Types.ObjectId().toString();
//             mockTextRepository.findOneEntity.mockResolvedValue(null);

//             await expect(service.delete(id)).rejects.toThrow(NotFoundException);
//         });
//     });

//     // Test cases for text analysis methods
//     describe('getWordCount', () => {
//         it('should return the word count of a text', async () => {
//             const content = 'Lorem ipsum dolor sit amet';
//             const wordCount = 5;
//             mockResponseUtils.successResponseHandler.mockReturnValue({ wordCount });

//             expect(await service.getWordCount(content)).toEqual({ wordCount });
//         });
//     });

//     describe('getCharacterCount', () => {
//         it('should return the character count of a text', async () => {
//             const content = 'Lorem ipsum dolor sit amet';
//             const charCount = 26;
//             mockResponseUtils.successResponseHandler.mockReturnValue({ charCount });

//             expect(await service.getCharacterCount(content)).toEqual({ charCount });
//         });
//     });

//     describe('getSentenceCount', () => {
//         it('should return the sentence count of a text', async () => {
//             const content = 'Lorem ipsum dolor sit amet. Consectetur adipiscing elit.';
//             const sentenceCount = 2;
//             mockResponseUtils.successResponseHandler.mockReturnValue({ sentenceCount });

//             expect(await service.getSentenceCount(content)).toEqual({ sentenceCount });
//         });
//     });

//     describe('getParagraphCount', () => {
//         it('should return the paragraph count of a text', async () => {
//             const content = 'Lorem ipsum dolor sit amet.\nConsectetur adipiscing elit.';
//             const paragraphCount = 2;
//             mockResponseUtils.successResponseHandler.mockReturnValue({ paragraphCount });

//             expect(await service.getParagraphCount(content)).toEqual({ paragraphCount });
//         });
//     });

//     describe('getLongestWord', () => {
//         it('should return the longest word in a text', async () => {
//             const content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
//             const longestWord = 'consectetur';
//             mockResponseUtils.successResponseHandler.mockReturnValue({ longestWord });

//             expect(await service.getLongestWord(content)).toEqual({ longestWord });
//         });
//     });
// });
import { Test, TestingModule } from '@nestjs/testing';
import { TextService } from './text.service';
import { CacheModule } from '@nestjs/cache-manager';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Text } from './schema/Text.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as RedisStore from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';

describe('TextService', () => {
  let service: TextService;
  let cacheManager: Cache;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register<RedisClientOptions>({
          store: RedisStore as any,
          url: 'redis://localhost:6379',
        }),
      ],
      providers: [
        TextService,
        { provide: getModelToken(Text.name), useValue: {} }, // Mock Model
        { provide: CACHE_MANAGER, useValue: { get: jest.fn(), set: jest.fn() } }, // Mock Cache
      ],
    }).compile();

    service = module.get<TextService>(TextService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should return cached word count', async () => {
    const content = 'test content';
    await service.getWordCount(content); // This would populate the cache
    
    const result = await service.getWordCount(content);
    expect(result).toEqual({
      statusCode: 200,
      message: 'Word count retrieved from cache',
      data: 2, // Ensure this matches the expected cached value
    });
  });
  
  it('should cache word count', async () => {
    const content = 'test content';
    const wordCount = 2; // Set the expected word count
  
    const result = await service.getWordCount(content);
    expect(result).toEqual({
      statusCode: 200,
      message: 'Word count calculated',
      data: wordCount,
    });
  });
  
});
