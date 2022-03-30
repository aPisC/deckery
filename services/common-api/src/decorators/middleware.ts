import Koa from 'koa';
import { Controller, Symbols } from '../controller';

export type EndpointMiddleware<T extends Koa.Context = Koa.Context> = (
  target: Object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<(ctx: T, next: Koa.Next) => any>
) => void;
export type ControllerMiddleware = (target: { new (): Controller }) => void;

export function Middleware<T extends Koa.Context>(middleware: Koa.Middleware): EndpointMiddleware<T>;
export function Middleware(middleware: Koa.Middleware): ControllerMiddleware;
export function Middleware(midleware: Koa.Middleware) {
  return function (target: any, propertyKey?: string, descriptor?: PropertyDescriptor): void {
    if (descriptor) {
      const orig: any = descriptor.value;

      descriptor.value = function (...args: any[]) {
        const [ctx] = args;
        return midleware(ctx, () => orig.call(this, ...args));
      };
    } else {
      if (!Reflect.hasMetadata(Symbols.middlewares, target.constructor))
        Reflect.defineMetadata(Symbols.middlewares, [], target.constructor);

      const middlewares: Koa.Middleware[] = Reflect.getMetadata(Symbols.middlewares, target.constructor);

      middlewares.push(midleware);
    }
  };
}
