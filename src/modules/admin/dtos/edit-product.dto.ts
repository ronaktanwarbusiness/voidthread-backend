import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class EditProductDto extends PartialType(CreateProductDto) {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
