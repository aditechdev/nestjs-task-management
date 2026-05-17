/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler,
} from '@nestjs/common';

import { instanceToPlain } from 'class-transformer';

import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,

    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(map((data) => instanceToPlain(data)));
  }
}
