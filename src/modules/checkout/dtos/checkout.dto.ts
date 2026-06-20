import { IsString, IsNotEmpty } from 'class-validator';

export class PlaceOrderDto {
  @IsString()
  @IsNotEmpty()
  billing_address_id: string;

  @IsString()
  @IsNotEmpty()
  shipping_address_id: string;
}
