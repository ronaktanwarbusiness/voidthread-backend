import { Body, Controller, Get, Post } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { PlaceOrderDto } from './dtos/checkout.dto';
import { GetSession } from 'src/decorators/session';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get('summary')
  async getSummary(@GetSession('user_id') userId: string) {
    return this.checkoutService.getSummary(userId);
  }

  @Post('place-order')
  async placeOrder(
    @Body() dto: PlaceOrderDto,
    @GetSession('user_id') userId: string,
  ) {
    return this.checkoutService.placeOrder(dto, userId);
  }
}
