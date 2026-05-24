import { PartialType } from '@nestjs/mapped-types';
import { CreateCollectionDto } from './create-collection.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class EditCollectionDto extends PartialType(CreateCollectionDto) {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
