import Koa from 'koa';

export type EndpointMiddlewareDecorator = (
  target: Object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
) => void;

export interface RequestContext<TRequestBody> extends Koa.Context {
  request: Request<TRequestBody>;
}

interface Request<TRequestBody> extends Koa.Request {
  body: TRequestBody;
}
