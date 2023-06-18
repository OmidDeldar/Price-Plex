import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { BILLING_SERVICE } from '../constants/services';
import { CreateOrderRequest } from '../dto/create-order.request';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PriceSendToAllRQ } from '../dto/price.send.to.all.dto';
import { ConvertPriceDto } from '../dto/convert.price.dto';

@Injectable()
export class RabbitProviderService {
  constructor(
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) { }

  // @Cron(CronExpression.EVERY_SECOND)
  // async sendMsg(){
  //   const createReq: CreateOrderRequest = {
  //     name: "test",
  //     price: 4,
  //     phoneNumber: "+15083418372"
  //   }
  //   await this.createOrder(createReq)
  // }


  async createOrder(createOrder: CreateOrderRequest){
    try {
      for(let i = 0; i<= 100;i++)
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          createOrder,
        }),
      );
      return true;
    } catch (err) {
      throw err;
    }
  }
  async sendPriceConvert(request: PriceSendToAllRQ) {
    try {
      // for(let i = 0; i<= 100;i++)
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

  async sendPriceOtc(request: ConvertPriceDto) {
    try {
      // for(let i = 0; i<= 100;i++)
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
