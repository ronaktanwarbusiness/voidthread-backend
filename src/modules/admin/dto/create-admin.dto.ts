import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { AdminRole } from '../schemas/admin-user.schema';

export class CreateAdminDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: 'admin@voidthread.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: AdminRole, default: AdminRole.ADMIN })
  @IsEnum(AdminRole)
  @IsNotEmpty()
  role: AdminRole;
}
