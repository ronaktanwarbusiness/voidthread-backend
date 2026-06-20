import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { AddressType } from 'src/database/schemas/address.schema';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address_line1: string;

  @IsOptional()
  @IsString()
  address_line2?: string;

  @IsOptional()
  @IsString()
  landmark?: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsString()
  @IsNotEmpty()
  pincode: string;

  @IsEnum(AddressType)
  type: AddressType;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  full_name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address_line1?: string;

  @IsOptional()
  @IsString()
  address_line2?: string;

  @IsOptional()
  @IsString()
  landmark?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  pincode?: string;

  @IsOptional()
  @IsEnum(AddressType)
  type?: AddressType;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
