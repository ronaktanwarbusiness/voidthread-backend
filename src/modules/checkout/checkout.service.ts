import { BadRequestException, Injectable } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { AddressService } from '../address/address.service';
import { PaymentService } from '../payment/payment.service';
import { PlaceOrderDto } from './dtos/checkout.dto';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly cartService: CartService,
    private readonly addressService: AddressService,
    private readonly paymentService: PaymentService,
  ) {}

  async getSummary(userId: string) {
    const [cartResult, addresses] = await Promise.all([
      this.cartService.getCart(userId),
      this.addressService.getAddresses(userId),
    ]);

    const billing = addresses.filter((a) => a.type === 'BILLING');
    const shipping = addresses.filter((a) => a.type === 'SHIPPING');

    return {
      cart: cartResult.data,
      addresses: {
        billing,
        shipping,
      },
    };
  }

  async placeOrder(dto: PlaceOrderDto, userId: string) {
    const cartResult = await this.cartService.getCart(userId);
    const { items } = cartResult.data;

    if (!items || items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    return this.paymentService.createPayment(
      {
        billing_address_id: dto.billing_address_id,
        shipping_address_id: dto.shipping_address_id,
      },
      userId,
    );
  }
}
