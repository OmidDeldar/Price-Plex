import { Controller, Get, UseGuards } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { RabbitConsumerService } from './rabbit-consumer.service';

@Controller()
export class RabbitConsumerController {
  constructor(
    private readonly rabbitConsumerService: RabbitConsumerService,
    private readonly rmqService: RmqService,
  ) {}

  @Get()
  getHello(): string {
    return this.rabbitConsumerService.getHello();
  }

  @EventPattern('order_created')
  async getOrder(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rabbitConsumerService.bill(data);
    // this.rmqService.ack(context);
  }


  @EventPattern('price_convert_sented')
  async sentPriceConvert(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rabbitConsumerService.bill(data);
    // this.rmqService.ack(context);
  }

  @EventPattern('price_otc_sented')
  async sentPriceOtc(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rabbitConsumerService.bill(data);
    // this.rmqService.ack(context);
  }
}
