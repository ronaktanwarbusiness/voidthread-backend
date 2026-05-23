import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsArray,
  IsOptional,
  IsEnum,
  IsMongoId,
} from 'class-validator';

export class CreateVariantDto {
  @IsMongoId()
  @IsNotEmpty()
  product_id: string;

  @IsEnum(['S', 'M', 'L', 'XL', 'XXL'], {
    message: 'Size must be one of S, M, L, XL, XXL',
  })
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  stock: number;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsEnum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'])
  @IsOptional()
  status?: string;
}
