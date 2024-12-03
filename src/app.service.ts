import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';

@Injectable()
export class AppService {
  getHello(): number {
    return dayjs().unix();
  }
}
