import 'reflect-metadata';
import { Symbols } from './controller';

type HttpMethod = 'get' | 'post' | 'put' | 'del' | 'all';

export interface RouteDefinition {
  method: HttpMethod;
  handler: string | Symbol;
  path: string;
}

function RouteDecorator(method: HttpMethod, path?: string): MethodDecorator {
  return function <T>(target: Object, propertyKey: string | Symbol, descriptor: TypedPropertyDescriptor<T>): void {
    // Route definition
    if (!path) path = `/${propertyKey}`;
    if (!Reflect.hasMetadata(Symbols.routes, target.constructor))
      Reflect.defineMetadata(Symbols.routes, [], target.constructor);

    const routes: RouteDefinition[] = Reflect.getMetadata(Symbols.routes, target.constructor);

    routes.push({
      path,
      method,
      handler: propertyKey,
    });
  };
}

export const Route = {
  Get: (path?: string) => RouteDecorator('get', path),
  Post: (path?: string) => RouteDecorator('post', path),
  Put: (path?: string) => RouteDecorator('put', path),
  Delete: (path?: string) => RouteDecorator('del', path),
  All: (path?: string) => RouteDecorator('all', path),
};
