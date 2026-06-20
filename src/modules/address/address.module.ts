import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { Address, AddressSchema } from 'src/database/schemas/address.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
  ],
  providers: [AddressService],
  controllers: [AddressController],
  exports: [AddressService],
})
export class AddressModule {}
