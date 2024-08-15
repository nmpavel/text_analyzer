import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/core/abstract-entity';

export type UserDocument = User & Document;

@Schema({ timestamps: true, id: true, versionKey: false })
export class User extends AbstractDocument {
  @Prop({ required: true, index: true, unique: true })
  userName: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    default: 'user',
    enum: ['user', 'admin']
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

