import {Body, Controller, Delete, Get, Param, Patch, Post} from "@nestjs/common";
import {TextService} from "./Text.service";
import {CreateTextDto} from "./dto/create-Text.dto";
import {UpdateTextDto} from "./dto/update-Text.dto";

@Controller({path: "text"})

export class TextController {
    constructor(private readonly service: TextService) {
    }

    @Post()
    create(@Body() dto: CreateTextDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.service.findOne(id);
    }

    @Patch("/:id")
    update(@Param("id") id: string, @Body() dto: UpdateTextDto) {
        return this.service.update(id, dto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return await this.service.delete(id);
    }

    @Get(':id/word-count')
    async getWordCount(@Param('id') id: string) {
      const text:any = await this.service.findOne(id);
      return { data: await this.service.getWordCount(text.data.content) };
    }
  
    @Get(':id/character-count')
    async getCharacterCount(@Param('id') id: string) {
      const text:any = await this.service.findOne(id);
      return { data: await this.service.getCharacterCount(text.data.content) };
    }
  
    @Get(':id/sentence-count')
    async getSentenceCount(@Param('id') id: string) {
        const text:any = await this.service.findOne(id);
      return { data: await this.service.getSentenceCount(text.data.content) };
    }
  
    @Get(':id/paragraph-count')
    async getParagraphCount(@Param('id') id: string) {
        const text:any = await this.service.findOne(id);
      return { data: await this.service.getParagraphCount(text.data.content) };
    }
  
    @Get(':id/longest-word')
    async getLongestWord(@Param('id') id: string) {
        const text:any = await this.service.findOne(id);
      return { data: await this.service.getLongestWord(text.data.content) };
    }
}
