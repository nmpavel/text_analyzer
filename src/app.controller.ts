import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly logger: Logger) {}

  @Get()
  getHello(): string {
    this.logger.verbose("hello")
    return this.appService.getHello();
  }
}
