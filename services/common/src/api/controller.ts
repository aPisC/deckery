import Router from 'koa-router';
import 'reflect-metadata';
import Koa from 'koa';
import { RouteDefinition } from './route';
import { kebabize } from '../utils/kebabize';

export const Symbols = {
  routerOptions: Symbol(),
  routes: Symbol(),
  middlewares: Symbol(),
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
    const middlewares: Koa.Middleware[] = Reflect.getMetadata(Symbols.middlewares, this.constructor) || [];
    middlewares.forEach((m) => this.__router.use(m));

    // Apply routes
    const routes: RouteDefinition[] = Reflect.getMetadata(Symbols.routes, this.constructor) || [];
    routes.forEach((r) =>
      this.__router[r.method](r.path, (ctx, next: any) => (this as any)[r.handler as string](ctx, next))
    );
  }

  private resolveControllerPath() {
    let name = this.constructor.name;
    if (name.endsWith('Controller')) name = name.substring(0, name.length - 10);
    return `/${kebabize(name)}`;
  }
}
