import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RabbitConsumerService {
  private readonly logger = new Logger(RabbitConsumerService.name);

  getHello(): string {
    return 'Hello World!';
  }

  

  bill(data: any) {
    this.logger.log('Billing...', data);
  }
}
