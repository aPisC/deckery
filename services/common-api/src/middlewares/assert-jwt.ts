import Koa from 'koa';
import { ApiError } from '../api-error';

export function AssertJwt(ctx: Koa.Context, next: Koa.Next) {
  if (ctx.state.jwtOriginalError && ctx.state.jwtOriginalError.message != 'jwt must be provided')
    throw ApiError.asApiError(ctx.state.jwtOriginalError, 400);
  return next();
}
