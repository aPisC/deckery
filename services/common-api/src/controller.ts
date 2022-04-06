import Router from 'koa-router';
import 'reflect-metadata';
import Koa from 'koa';
import { RouteDefinition } from './decorators/route';
import { kebabize } from '@deckery/common-utils';
import { ReturnJson } from './middlewares';
import { Map, Validator } from './decorators';

export const Symbols = {
  routerOptions: Symbol(),
  routes: Symbol(),
  middlewares: Symbol(),
  mappers: Symbol(),
  validators: Symbol(),
};

export class Controller {
  public __router: Router;

  constructor() {
    // Create router configuration
    const defaultRouterOptions: Router.IRouterOptions = {
      prefix: this.resolveControllerPath(),
    };
    const overrideRouterOptions: Router.IRouterOptions =
      Reflect.getMetadata(Symbols.routerOptions, this.constructor) || {};
    const routerOptions = {
      ...defaultRouterOptions,
      ...overrideRouterOptions,
    };

    // Initialize router
    this.__router = new Router(routerOptions);

    // Apply controller middlewares
    const middlewares: Koa.Middleware[] = Reflect.getMetadata(Symbols.middlewares, this) || [];
    middlewares.forEach((m) => this.__router.use(m));

    // Apply Return value middleware
    this.__router.use(ReturnJson);

    // Apply routes
    const routes: RouteDefinition[] = Reflect.getMetadata(Symbols.routes, this) || [];
    routes.forEach((r) => {
      //// Resolve mappers
      //const mappers: Array<Map.MapperFunction<any> | null> =
      //  Reflect.getMetadata(Symbols.mappers, this, r.handler) || [];

      //// Add context default mapper
      //if (mappers.indexOf(null) >= 0) mappers[mappers.indexOf(null)] = (ctx) => ctx;
      //else mappers.push((ctx) => ctx);

      //// Add next default mapper
      //if (mappers.indexOf(null) >= 0) mappers[mappers.indexOf(null)] = (ctx, next) => next;
      //else mappers.push((ctx, next) => next);

      //// Resolve validators
      //const validators: Array<Validator> = Reflect.getMetadata(Symbols.validators, this, r.handler) || [];

      // Register route handler
      this.__router[r.method](r.path, (ctx, next: any) => {
        //const args: any[] = mappers.map((m) => m && m(ctx, next));
        //validators.forEach((v) => v(...args, ctx, next));
        return (this as any)[r.handler as string](ctx, next);
      });
    });
  }

  private resolveControllerPath() {
    let name = this.constructor.name;
    if (name.endsWith('Controller')) name = name.substring(0, name.length - 10);
    return `/${kebabize(name)}`;
  }
}
