import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/core/abstract-entity';

@Schema({ timestamps: true, id: true, versionKey: false })
export class Text extends AbstractDocument {
  @Prop({ required: true })
  content: string;
}

export const TextSchema = SchemaFactory.createForClass(Text);