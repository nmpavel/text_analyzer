import mongoose, { Model, Types } from 'mongoose';
import { Text } from './schema/Text.schema';
import { CreateTextDto } from './dto/create-Text.dto';
import { UpdateTextDto } from './dto/update-Text.dto';

export class TextRepository<TextDocument extends Text> {
    constructor(private readonly model: Model<TextDocument>) { }

    async createEntity(data: CreateTextDto): Promise<Text> {
        const createdEntity = new this.model({
            ...data,
            _id: new Types.ObjectId()
        });
        return await createdEntity.save();
    }

    async findOneEntity(id: string): Promise<Text | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await this.model.findOne({ _id: id, isDeleted: false });
    }

    async updateEntity(id: string, data: UpdateTextDto): Promise<Text | null> {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteEntity(id: string): Promise<boolean> {
        const data = await this.model.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );
        if (data) return true;
        return false;
    }

    async findAll(): Promise<Text[]> {
        return await this.model.find({ isDeleted: false });
    }
}