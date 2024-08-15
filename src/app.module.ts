import { Logger, Module  } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TextModule } from './modules/text/text.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import * as RedisStore from 'cache-manager-redis-yet';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { AuthModule } from './modules/auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
  }),
  ThrottlerModule.forRoot({
    throttlers: [
      {
        name: 'default',
        limit: 5,
        ttl: 30,
      },
    ],
  }),
 
  CacheModule.register<RedisClientOptions>({
    store: RedisStore as any,
    url: 'redis://localhost:6379',
  }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    TextModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [Logger, AppService],
})
export class AppModule {}
