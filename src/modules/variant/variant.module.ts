import { Module } from '@nestjs/common';
import { VariantService } from './variant.service';
import { VariantController } from './variant.controller';

@Module({
  providers: [VariantService],
  controllers: [VariantController],
  exports: [VariantService],
})
export class VariantModule {}
