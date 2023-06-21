import {
  CacheModule as BaseCashModule,
  DynamicModule,
  Module,
} from '@nestjs/common';
import { RedisPlusService } from './services/redis-plus.service';
import { RedisService } from './services/redis.service';


const redisStore = require('cache-manager-ioredis');


@Module({})
export class RedisModule {
  static forRoot(host?: string, port?: number): DynamicModule {
    return {
      imports: [
        BaseCashModule.registerAsync({
          useFactory: () => {
            return {
              store: redisStore,
              host: '192.168.35.45'  || '127.0.0.1',
              port: 6379 || 6379,
            };
          },
        }),
      ],
      module: RedisModule,
      providers: [RedisService , RedisPlusService],
      exports: [RedisService, BaseCashModule ,RedisPlusService],
      global:true
    };
  }
}
