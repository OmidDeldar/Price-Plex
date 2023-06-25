import { Module } from '@nestjs/common';
import { RmqModule } from '@app/common';
import * as Joi from 'joi';
import { RabbitConsumerController } from './rabbit-consumer.controller';
import { RabbitConsumerService } from './rabbit-consumer.service';
import { ConfigModule } from '@nestjs/config';
import { PriceGateway } from './socket/pricing.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_BILLING_QUEUE: Joi.string().required(),
      }),
    }),
    RmqModule,
  ],
  controllers: [RabbitConsumerController],
  providers: [
    RabbitConsumerService,
    PriceGateway
  ],
})
export class RabbitConsumerModule {}
