import mongoose, { Model, Types } from 'mongoose';
import { Text } from './schema/Text.schema';
import { CreateTextDto } from './dto/create-Text.dto';
import { UpdateTextDto } from './dto/update-Text.dto';
import { Logger } from 'nestjs-pino';

export class TextRepository<TextDocument extends Text> {
    constructor(private readonly model: Model<TextDocument>) { }
    private readonly logger: Logger;

     async createEntity(data: CreateTextDto): Promise<Text> {
        this.logger.verbose('Creating a new text entity', data);
        
        const createdEntity = new this.model({
            ...data,
            _id: new Types.ObjectId()
        });
        
        try {
            const result = await createdEntity.save();
            this.logger.debug('New text entity created successfully', result);
            return result;
        } catch (error) {
            this.logger.error('Failed to create new text entity', error);
            throw error;
        }
    }

    async findOneEntity(id: string): Promise<Text | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            this.logger.warn(`Invalid ObjectId: ${id}`);
            return null;
        }
        
        this.logger.verbose(`Finding text entity by id: ${id}`);
        
        try {
            const entity = await this.model.findOne({ _id: id, isDeleted: false });
            if (!entity) {
                this.logger.debug(`Text entity not found with id: ${id}`);
            } else {
                this.logger.debug('Text entity found', entity);
            }
            return entity;
        } catch (error) {
            this.logger.error(`Error while finding text entity with id: ${id}`, error);
            throw error;
        }
    }

    async updateEntity(id: string, data: UpdateTextDto): Promise<Text | null> {
        this.logger.verbose(`Updating text entity with id: ${id}`, data);

        try {
            const updatedEntity = await this.model.findByIdAndUpdate(id, data, { new: true });
            if (!updatedEntity) {
                this.logger.debug(`Failed to update text entity. Not found: ${id}`);
            } else {
                this.logger.debug('Text entity updated successfully', updatedEntity);
            }
            return updatedEntity;
        } catch (error) {
            this.logger.error(`Failed to update text entity with id: ${id}`, error);
            throw error;
        }
    }

    async deleteEntity(id: string): Promise<boolean> {
        this.logger.verbose(`Marking text entity as deleted with id: ${id}`);
        
        try {
            const data = await this.model.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
            if (data) {
                this.logger.debug(`Text entity marked as deleted: ${id}`);
                return true;
            } else {
                this.logger.debug(`Failed to mark text entity as deleted. Not found: ${id}`);
                return false;
            }
        } catch (error) {
            this.logger.error(`Failed to delete text entity with id: ${id}`, error);
            throw error;
        }
    }

    async findAll(): Promise<Text[]> {
        this.logger.verbose('Retrieving all text entities');
        
        try {
            const result = await this.model.find({ isDeleted: false });
            this.logger.debug(`Retrieved ${result.length} text entities`);
            return result;
        } catch (error) {
            this.logger.error('Failed to retrieve all text entities', error);
            throw error;
        }
    }
}