import { Injectable, Logger } from '@nestjs/common';
import { PriceGateway } from './socket/pricing.gateway';

@Injectable()
export class RabbitConsumerService {
  private readonly logger = new Logger(RabbitConsumerService.name);

  constructor(
    private priceGateway: PriceGateway
  ){}
  getHello(): string {
    return 'Hello World!';
  }

  

  bill(data: any) {
    // const parsedData = JSON.parse(data);
    this.logger.log('Billing...', data.request);
    // this.logger.log('name', parsedData.createOrder.name);
    if(data?.request?.to_crypto){
      this.priceGateway.getPriceConvert(data);
    }
    else if(data?.request?.to){
      this.priceGateway.getPriceOtc(data);
    }
  }
}
