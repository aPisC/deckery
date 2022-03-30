import Koa from 'koa';
import Router from 'koa-router';
import compose from 'koa-compose';

export function HealthCheck(
  handler?: (() => Promise<any>) | any
): Koa.Middleware<any, Router.IRouterParamContext<any, {}>, any> {
  const router = new Router();

  router.get('/health', (ctx, next) => {
    if (!handler)
      return void (ctx.body = {
        status: 'UP',
      });

    if (typeof handler == 'function') return void (ctx.body = handler());

    ctx.body = handler;
  });

  return compose([router.routes(), router.allowedMethods()]);
}
