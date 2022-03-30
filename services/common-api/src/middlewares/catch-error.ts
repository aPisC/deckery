import Koa from 'koa';
import { ApiError } from '../api-error';

export async function CatchError(ctx: Koa.Context, next: Koa.Next) {
  try {
    const response = await next();
    return response;
  } catch (err) {
    if (err instanceof Error) {
      const apiError = ApiError.asApiError(err);
      if (apiError.status >= 500) console.log('Error handler:', err);
      ctx.status = apiError.status;
      ctx.body = apiError.toJson();
    } else {
      throw err;
    }
  }
}
