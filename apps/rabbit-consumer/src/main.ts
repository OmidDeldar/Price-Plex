import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/common';
import { RabbitConsumerModule } from './rabbit-consumer.module';

async function bootstrap() {
  const app = await NestFactory.create(RabbitConsumerModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('BILLING'));
  await app.startAllMicroservices();
  await app.listen(42625);
}
bootstrap();
