import {Module} from "@nestjs/common";
import {TextController} from "./Text.controller";
import {TextService} from "./Text.service";
import { MongooseModule } from "@nestjs/mongoose";
import { TextSchema } from "./schema/Text.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Text', schema: TextSchema }]),
    ],
    controllers: [TextController],
    providers: [TextService]
})
export class TextModule {
}
