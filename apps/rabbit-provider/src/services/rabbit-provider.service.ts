import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { BILLING_SERVICE } from '../constants/services';
import { CreateOrderRequest } from '../dto/create-order.request';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RabbitProviderService {
  constructor(
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  // @Cron(CronExpression.EVERY_SECOND)
  // async sendMsg(){
  //   const createReq: CreateOrderRequest = {
  //     name: "test",
  //     price: 4,
  //     phoneNumber: "+15083418372"
  //   }
  //   await this.createOrder(createReq)
  // }

  async createOrder(request: CreateOrderRequest) {
    try {
      for(let i = 0; i<= 100;i++)
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request,
        }),
      );
      return true;
    } catch (err) {
      throw err;
    }
  }
}
