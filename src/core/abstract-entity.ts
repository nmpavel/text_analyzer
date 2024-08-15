import { Prop, Schema } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema()
export class AbstractDocument {
  @Prop({ type: Date })
  createdAt?: Date

  @Prop({ type: Date })
  updatedAt?: Date

  @Prop({ type: Boolean, default: false })
  isDeleted?: Boolean
}