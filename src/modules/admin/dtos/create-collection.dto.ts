import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsEnum,
  IsMongoId,
} from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  product_ids?: string[];

  @IsString()
  @IsNotEmpty()
  banner_img: string;

  @IsEnum(['ACTIVE', 'INACTIVE'])
  @IsOptional()
  status?: string;
}
