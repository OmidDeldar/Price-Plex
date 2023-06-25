import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateOrderRequest } from './dto/create-order.request';
import { RabbitProviderService } from './services/rabbit-provider.service';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: RabbitProviderService) {}

  @Post()
  async createOrder(@Body() request: CreateOrderRequest) {
    return this.ordersService.createOrder(request);
  }
}
