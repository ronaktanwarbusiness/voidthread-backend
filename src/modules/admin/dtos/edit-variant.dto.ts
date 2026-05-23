import { PartialType } from '@nestjs/mapped-types';
import { CreateVariantDto } from './create-variant.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class EditVariantDto extends PartialType(CreateVariantDto) {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
