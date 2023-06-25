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
    // this.logger.log('Billing...', data.request);
    if(data?.request?.to_crypto){
      this.priceGateway.getPriceConvert(data?.request);
    }
    else if(data?.request?.to){
      this.priceGateway.getPriceOtc(data?.request);
    }
  }
}
