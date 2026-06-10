import { Body, Controller, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import {
  AddToCartDto,
  RemoveFromCartDto,
  UpdateQuantityDto,
} from './dtos/add-to-cart.dto';
import { GetSession } from 'src/decorators/session';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-to-cart')
  async addToCart(
    @Body() dto: AddToCartDto,
    @GetSession('user_id') user_id: string,
  ) {
    return this.cartService.addToCart(dto, user_id);
  }

  @Post('update-quantity')
  async updateQuantity(
    @Body() dto: UpdateQuantityDto,
    @GetSession('user_id') user_id: string,
  ) {
    return this.cartService.updateQuantity(dto, user_id);
  }

  @Post('remove-from-cart')
  async removeFromCart(
    @Body() dto: RemoveFromCartDto,
    @GetSession('user_id') user_id: string,
  ) {
    return this.cartService.removeFromCart(dto, user_id);
  }

  @Post('clear-cart')
  async clearCart(@GetSession('user_id') user_id: string) {
    return this.cartService.clearCart(user_id);
  }

  @Post('get-cart')
  async getCart(@GetSession('user_id') user_id: string) {
    return this.cartService.getCart(user_id);
  }
}
