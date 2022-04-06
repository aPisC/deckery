import 'reflect-metadata';
import { Symbols } from '../controller';
import { Map } from './mappers';
import { Validate } from './validate';

export const Route = {
  Get: (path?: string, options: RouteOptions = defaultOptions) => RouteDecorator('get', path, options),
  Post: (path?: string, options: RouteOptions = defaultOptions) => RouteDecorator('post', path, options),
  Put: (path?: string, options: RouteOptions = defaultOptions) => RouteDecorator('put', path, options),
  Delete: (path?: string, options: RouteOptions = defaultOptions) => RouteDecorator('del', path, options),
  All: (path?: string, options: RouteOptions = defaultOptions) => RouteDecorator('all', path, options),
};

function RouteDecorator(method: HttpMethod, path?: string, options: RouteOptions = defaultOptions): MethodDecorator {
  return function <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): void {
    // Apply validation and mapper decorators
    if (options.enableValidator) Validate.Apply()(target, propertyKey, descriptor);
    if (options.enableMapper) Map.Apply()(target, propertyKey, descriptor);

    // Route definition
    if (!path) path = `/${String(propertyKey)}`;
    const routes: RouteDefinition[] = Reflect.getMetadata(Symbols.routes, target)?.slice() || [];
    Reflect.defineMetadata(Symbols.routes, routes, target);

    routes.push({
      path,
      method,
      handler: propertyKey,
    });
  };
}

type HttpMethod = 'get' | 'post' | 'put' | 'del' | 'all';

export interface RouteDefinition {
  method: HttpMethod;
  handler: string | symbol;
  path: string;
}

export interface RouteOptions {
  enableMapper?: boolean;
  enableValidator?: boolean;
}

const defaultOptions: RouteOptions = {
  enableMapper: true,
  enableValidator: true,
};
