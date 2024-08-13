import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TextModule } from './modules/text/text.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
  }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    TextModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
