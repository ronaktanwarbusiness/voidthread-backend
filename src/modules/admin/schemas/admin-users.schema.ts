import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum AdminRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
}

@Schema({ timestamps: true, collection: 'adminusers' })
export class AdminUser extends Document {
  @Prop({ required: true, trim: true })
  first_name: string;

  @Prop({ required: true, trim: true })
  last_name: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, select: false }) // Password should not be returned by default
  password: string;

  @Prop({
    required: true,
    enum: AdminRole,
    default: AdminRole.ADMIN,
  })
  role: string;
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);
