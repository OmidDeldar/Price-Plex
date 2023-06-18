import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { OriginRedisModule, RmqModule } from '@app/common';
import { OrdersController } from './orders.controller';
import { RabbitProviderService } from './services/rabbit-provider.service';
import { BILLING_SERVICE } from './constants/services';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceEnt } from './entities/price.entity';
import { OrmConfigModulePostgres } from '@app/common';
import { BotIrrService } from './services/bot.irr.service';
import { BotManualCoinsService } from './services/bot.manual.coins.service';
import { BotStableCoinService } from './services/bot.stable.coin.service';
import { CryptoPricingService } from './services/crypto.pricing.service';
import { GlobalService } from './services/global.service';
import { PriceRepo } from './repositories/price.repository';
import { PriceService } from './services/price.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/rabbit-provider/.env',
    }),
    RmqModule.register({
      name: BILLING_SERVICE,
    }),
    // TypeOrmModule.forRootAsync({
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get<string>('DB_HOST'),
    //     port: configService.get<number>('DB_PORT'),
    //     username: configService.get<string>('DB_USERNAME'),
    //     password: configService.get<string>('DB_PASSWORD'),
    //     database: configService.get<string>('DB_DATABASE'),
    //     synchronize: true,
    //     autoLoadEntities: true,
    //   })
    // }),
    TypeOrmModule.forRootAsync(OrmConfigModulePostgres),
    TypeOrmModule.forFeature([PriceEnt]),
    OriginRedisModule.forRoot('192.168.35.45', 6379),
    ScheduleModule.forRoot()
  ],
  controllers: [OrdersController],
  providers: [
    GlobalService,
    RabbitProviderService,
    BotManualCoinsService,
    BotIrrService,
    CryptoPricingService,
    BotStableCoinService,
    PriceService,
    PriceRepo 
  ],
})
export class RabbitProviderModule { }
