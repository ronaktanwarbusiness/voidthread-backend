import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('cashfree')
  async handleCashfreeWebhook(
    @Body() body: any,
    @Req() req: Request,
    @Headers('x-webhook-signature') signature: string,
    @Headers('x-webhook-timestamp') timestamp: string,
  ) {
    const rawBody = req['rawBody'];

    const isValid = this.paymentService.verifySignature(
      rawBody,
      signature,
      timestamp,
      process.env.CASHFREE_CLIENT_SECRET!,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid webhook signature');
    }
    await this.paymentService.handleCashfreeWebhook(body);
    return { success: true };
  }
}
