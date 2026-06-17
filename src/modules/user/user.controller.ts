import { Body, Controller, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { GetSession } from 'src/decorators/session';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('update')
  async updateUser(
    @Body() dto: UpdateUserDto,
    @GetSession('user_id') user_id: string,
  ) {
    return this.userService.updateUser(user_id, dto);
  }
}
