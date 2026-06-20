import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from 'src/database/schemas/address.schema';
import { CreateAddressDto, UpdateAddressDto } from './dtos/address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private readonly addressModel: Model<Address>,
  ) {}

  async createAddress(dto: CreateAddressDto, userId: string) {
    if (dto.is_default) {
      await this.addressModel.updateMany(
        { user_id: userId, type: dto.type },
        { is_default: false },
      );
    }

    const address = await this.addressModel.create({
      ...dto,
      user_id: userId,
    });

    return address;
  }

  async updateAddress(
    addressId: string,
    dto: UpdateAddressDto,
    userId: string,
  ) {
    const address = await this.addressModel.findById(addressId);

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.user_id.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (dto.is_default) {
      const typeToCheck = dto.type ?? address.type;
      await this.addressModel.updateMany(
        { user_id: userId, type: typeToCheck, _id: { $ne: addressId } },
        { is_default: false },
      );
    }

    Object.assign(address, dto);
    await address.save();

    return address;
  }

  async getAddresses(userId: string) {
    return this.addressModel.find({ user_id: userId }).sort({ createdAt: -1 });
  }

  async findAddressById(addressId: string, userId: string) {
    return this.addressModel.findOne({ _id: addressId, user_id: userId });
  }

  async deleteAddress(addressId: string, userId: string) {
    const address = await this.addressModel.findById(addressId);

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.user_id.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await address.deleteOne();

    return { message: 'Address deleted' };
  }
}
