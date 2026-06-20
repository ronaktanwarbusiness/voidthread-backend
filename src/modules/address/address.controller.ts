import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto, UpdateAddressDto } from './dtos/address.dto';
import { GetSession } from 'src/decorators/session';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('create')
  async createAddress(
    @Body() dto: CreateAddressDto,
    @GetSession('user_id') userId: string,
  ) {
    return this.addressService.createAddress(dto, userId);
  }

  @Patch('update/:id')
  async updateAddress(
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
    @GetSession('user_id') userId: string,
  ) {
    return this.addressService.updateAddress(id, dto, userId);
  }

  @Get('list')
  async getAddresses(@GetSession('user_id') userId: string) {
    return this.addressService.getAddresses(userId);
  }

  @Delete('delete/:id')
  async deleteAddress(
    @Param('id') id: string,
    @GetSession('user_id') userId: string,
  ) {
    return this.addressService.deleteAddress(id, userId);
  }
}
