import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Cart, CartDocument } from 'src/database/schemas/cart.schema';
import { Variant, VariantDocument } from 'src/database/schemas/variant.schema';
import {
  AddToCartDto,
  RemoveFromCartDto,
  UpdateQuantityDto,
} from './dtos/add-to-cart.dto';
import { Product, ProductDocument } from 'src/database/schemas/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cart_model: Model<CartDocument>,
    @InjectModel(Variant.name) private variant_model: Model<VariantDocument>,
    @InjectModel(Product.name) private product_model: Model<ProductDocument>,
  ) {}

  async addToCart(dto: AddToCartDto, user_id: string) {
    try {
      const { product_id, variant_id, quantity } = dto;
      const product = await this.product_model.findById(product_id);
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      const variant = await this.variant_model.findById(variant_id);
      if (!variant) {
        throw new NotFoundException('Variant not found');
      }
      if (variant.stock < quantity) {
        throw new BadRequestException('Insufficient stock');
      }

      const cart_item = {
        product_id: new mongoose.Types.ObjectId(product_id),
        variant_id: new mongoose.Types.ObjectId(variant_id),
        quantity,
      };

      let cart = await this.cart_model.findOne({ user_id });

      if (!cart) {
        cart = await this.cart_model.create({
          user_id,
          items: [cart_item],
        });
      } else {
        const existing_item = cart.items.find(
          (item) => item.variant_id.toString() === variant_id,
        );

        if (existing_item) {
          const new_quantity = existing_item.quantity + quantity;
          if (new_quantity > variant.stock) {
            throw new BadRequestException('Insufficient stock');
          }
          existing_item.quantity = new_quantity;
        } else {
          cart.items.push(cart_item);
        }

        await cart.save();
      }

      return {
        isSuccess: true,
        message: 'Cart added successfully',
        cart,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateQuantity(dto: UpdateQuantityDto, user_id: string) {
    try {
      const { variant_id, quantity } = dto;
      const cart = await this.cart_model.findOne({ user_id });
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      const item = cart.items.find(
        (cart_item) => cart_item.variant_id.toString() === variant_id,
      );

      if (!item) {
        throw new NotFoundException('Item not found in cart');
      }

      const variant = await this.variant_model.findById(variant_id);
      if (!variant) {
        throw new NotFoundException('Variant not found');
      }
      if (quantity > variant.stock) {
        throw new BadRequestException('Insufficient stock');
      }

      const updated_cart = await this.cart_model.findOneAndUpdate(
        {
          _id: cart._id,
          'items.variant_id': variant._id,
        },
        {
          $set: {
            'items.$.quantity': quantity,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!updated_cart) {
        throw new NotFoundException('Item not found in cart');
      }

      return {
        isSuccess: true,
        message: 'Cart updated successfully',
        cart: updated_cart,
      };
    } catch (error) {
      throw error;
    }
  }

  async removeFromCart(dto: RemoveFromCartDto, user_id: string) {
    try {
      const { variant_id } = dto;
      const cart = await this.cart_model.findOne({ user_id });
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      const item = cart.items.find(
        (cart_item) => cart_item.variant_id.toString() === variant_id,
      );

      if (!item) {
        throw new NotFoundException('Item not found in cart');
      }

      cart.items = cart.items.filter(
        (cart_item) => cart_item.variant_id.toString() !== variant_id,
      );
      await cart.save();
      return {
        isSuccess: true,
        message: 'Cart removed successfully',
        cart,
      };
    } catch (error) {
      throw error;
    }
  }

  async clearCart(user_id: string) {
    try {
      const cart = await this.cart_model.findOne({ user_id });
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }
      cart.items = [];
      await cart.save();
      return {
        isSuccess: true,
        message: 'Cart cleared successfully',
        cart,
      };
    } catch (error) {
      throw error;
    }
  }

  async getCart(user_id: string) {
    try {
      const cart = await this.cart_model.findOne({ user_id }).lean();
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      const product_ids = cart.items.map((item) => item.product_id.toString());

      const variant_ids = cart.items.map((item) => item.variant_id.toString());

      const [products, variants] = await Promise.all([
        this.product_model.find({ _id: { $in: product_ids } }).lean(),
        this.variant_model.find({ _id: { $in: variant_ids } }).lean(),
      ]);

      const product_map = new Map(
        products.map((product) => [product._id.toString(), product]),
      );

      const variant_map = new Map(
        variants.map((variant) => [variant._id.toString(), variant]),
      );

      const items = cart.items.flatMap((item) => {
        const product = product_map.get(item.product_id.toString());
        const variant = variant_map.get(item.variant_id.toString());

        if (!product || !variant) {
          return [];
        }

        return [
          {
            id: product._id.toString(),
            name: product.name,
            slug: product.slug,
            original_price: product.original_price,
            selling_price: product.selling_price,
            images: product.images,
            quantity: item.quantity,
            variant: {
              id: variant._id.toString(),
              size: variant.size,
              color: variant.color,
              // stock: variant.stock,
              // sku: variant.sku,
              // images: variant.images,
              // status: variant.status,
            },
          },
        ];
      });

      const price_breakup = items.reduce(
        (acc, item) => {
          acc.original_total += item.original_price * item.quantity;
          acc.selling_total += item.selling_price * item.quantity;
          acc.discount_total +=
            (item.original_price - item.selling_price) * item.quantity;
          acc.total_quantity += item.quantity;
          return acc;
        },
        {
          original_total: 0,
          selling_total: 0,
          discount_total: 0,
          total_quantity: 0,
          item_count: items.length,
        },
      );

      return {
        isSuccess: true,
        data: {
          items,
          price_breakup,
          user_id: cart.user_id,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
