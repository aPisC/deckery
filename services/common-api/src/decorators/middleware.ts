import Koa from 'koa';
import { Controller, Symbols } from '../controller';
import { EndpointMiddlewareDecorator } from '../types';

export type ControllerMiddleware = (target: { new (): Controller }) => void;

export function Middleware<TRequest, TResponse>(middleware: Koa.Middleware): EndpointMiddlewareDecorator;
export function Middleware(middleware: Koa.Middleware): ControllerMiddleware;
export function Middleware(midleware: Koa.Middleware) {
  return function (target: any, propertyKey?: string, descriptor?: PropertyDescriptor): void {
    if (descriptor) {
      const orig: any = descriptor.value;

      descriptor.value = function (ctx: any, next: any) {
        return midleware(ctx, () => orig.call(this, ctx, next));
      };
    } else {
      const middlewares: Koa.Middleware[] = Reflect.getMetadata(Symbols.middlewares, target)?.slice() || [];
      Reflect.defineMetadata(Symbols.middlewares, middlewares, target);

      middlewares.push(midleware);
    }
  };
}
