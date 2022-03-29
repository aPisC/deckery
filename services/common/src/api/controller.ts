import * as Router from 'koa-router';
import 'reflect-metadata';
import * as Koa from 'koa';
import { RouteDefinition } from './route';

export const Symbols = {
  routerOptions: Symbol(),
  routes: Symbol(),
  middlewares: Symbol(),
};

export class Controller {
  public __router: Router;

  constructor() {
    const routerOptions: Router.IRouterOptions = Reflect.getMetadata(Symbols.routerOptions, this.constructor) || {};
    this.__router = new Router(routerOptions);

    const middlewares: Koa.Middleware[] = Reflect.getMetadata(Symbols.middlewares, this.constructor) || [];
    middlewares.forEach((m) => this.__router.use(m));

    const routes: RouteDefinition[] = Reflect.getMetadata('controller.routes', this.constructor) || [];
    routes.forEach((r) =>
      this.__router[r.method](r.path, (ctx, next: any) => (this as any)[r.handler as string](ctx, next))
    );
  }
}
