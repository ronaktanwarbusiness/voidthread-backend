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
 * login(@SetSession() setSession: (key: string, value: any) => Promise<void>) {
 *   await setSession('userId', 123);
 * }
 * ```
 */
export const SetSession = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return (key: string, value: unknown): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (request.session) {
          (request.session as unknown as Record<string, unknown>)[key] = value;
          request.session.save((err) => {
            if (err) {
              return reject(new Error(String(err)));
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    };
  },
);

/**
 * Parameter decorator that provides a helper function to destroy the session.
 *
 * @example
 * ```ts
 * @Post('logout')
 * logout(@LogoutSession() logout: () => Promise<void>) {
 *   await logout();
 * }
 * ```
 */
export const LogoutSession = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (request.session) {
          request.session.destroy((err) => {
            if (err) {
              return reject(new Error(String(err)));
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    };
  },
);
