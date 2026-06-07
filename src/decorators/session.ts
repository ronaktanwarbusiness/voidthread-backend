import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Parameter decorator to retrieve a specific key from the session or the entire session object.
 *
 * @param key Optional key name to retrieve from the session.
 *
 * @example
 * ```ts
 * @Get()
 * getData(@GetSession('userName') name: string) {
 *   return name;
 * }
 * ```
 */
export const GetSession = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const session = request.session;
    console.log({ session });
    if (!session) return null;
    return key ? session[key as keyof typeof session] : session;
  },
);

/**
 * Parameter decorator that provides a helper function to set session values.
 *
 * @example
 * ```ts
 * @Post()
 * login(@SetSession() setSession: (key: string, value: any) => void) {
 *   setSession('userId', 123);
 * }
 * ```
 */
export const SetSession = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return (key: string, value: unknown) => {
      if (request.session) {
        (request.session as unknown as Record<string, unknown>)[key] = value;
      }
    };
  },
);
