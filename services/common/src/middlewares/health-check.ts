import Koa from 'koa';

export function HealthCheck(handler?: (() => Promise<any>) | any): Koa.Middleware {
  return (ctx) => {
    if (!handler)
      return void (ctx.body = {
        status: 'UP',
      });

    if (typeof handler == 'function') return void (ctx.body = handler());

    ctx.body = handler;
  };
}
