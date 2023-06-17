import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { RmqModule } from '@app/common';
import { OrdersController } from './orders.controller';
import { RabbitProviderService } from './services/rabbit-provider.service';
import { BILLING_SERVICE } from './constants/services';
import { ScheduleModule } from '@nestjs/schedule';

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
    // ScheduleModule.forRoot()
  ],
  controllers: [OrdersController],
  providers: [RabbitProviderService],
})
export class RabbitProviderModule {}
