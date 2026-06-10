// cart/dto/add-to-cart.dto.ts

import { IsString, IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  product_id: string;

  @IsString()
  variant_id: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateQuantityDto {
  @IsString()
  variant_id: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class RemoveFromCartDto {
  @IsString()
  variant_id: string;
}

export class ClearCartDto {}
