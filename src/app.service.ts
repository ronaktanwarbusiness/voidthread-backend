import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { isSuccess: boolean; message: string } {
    return { isSuccess: true, message: 'Hello World!' };
  }
}
