import { Controller, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { GetSession } from 'src/decorators/session';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('list')
  async getOrders(@GetSession('user_id') user_id: string) {
    return this.orderService.getOrders(user_id);
  }

  @Get(':id')
  async getOrderById(
    @Param('id') id: string,
    @GetSession('user_id') user_id: string,
  ) {
    return this.orderService.getOrderById(id, user_id);
  }
}
