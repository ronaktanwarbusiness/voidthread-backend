import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductSize } from '../schemas/product.schema';

export class VariantDto {
  @ApiProperty({ enum: ProductSize })
  @IsEnum(ProductSize)
  size: ProductSize;

  @ApiProperty({ example: 'Black' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsOptional()
  stock?: number;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Oversized Cotton Tee' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Premium quality 100% cotton tee' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'oversized' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 999 })
  @IsNumber()
  @IsNotEmpty()
  selling_price: number;

  @ApiProperty({ example: 1499 })
  @IsNumber()
  @IsNotEmpty()
  original_price: number;

  @ApiProperty({ enum: ['DRAFT', 'ACTIVE', 'ARCHIVED'], default: 'DRAFT' })
  @IsEnum(['DRAFT', 'ACTIVE', 'ARCHIVED'])
  @IsOptional()
  status?: string;

  @ApiProperty({ example: ['https://bucket.s3.region.amazonaws.com/image.jpg'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ type: [VariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  @IsOptional()
  variants?: VariantDto[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
