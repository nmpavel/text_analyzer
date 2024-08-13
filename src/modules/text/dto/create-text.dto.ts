import { IsNotEmpty } from "class-validator";

export class CreateTextDto {
    @IsNotEmpty()
    readonly content: string;
}
