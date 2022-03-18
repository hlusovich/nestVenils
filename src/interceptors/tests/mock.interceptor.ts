import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

export class MockInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<void>> {
    const req = context.switchToHttp().getRequest();
    console.log(req);
    return next.handle();
  }
}
