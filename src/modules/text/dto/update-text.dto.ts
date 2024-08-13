import { PartialType } from "@nestjs/mapped-types";
import { CreateTextDto } from "./create-Text.dto";

export class UpdateTextDto extends PartialType(CreateTextDto) {
}