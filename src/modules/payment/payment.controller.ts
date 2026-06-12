import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { GetSession } from 'src/decorators/session';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createPayment(@Body() body: CreatePaymentDto, @GetSession('user_id') user_id: string) {
    const response = await this.paymentService.createPayment(body, user_id);
    return response;
  }
}
