import * as Joi from 'joi';
import * as Koa from 'koa';
import { ControllerMiddleware, EndpointMiddleware, Middleware } from './middleware';

// Validating object schema
export function ValidateBody<TEntity extends {}>(
  schema: Joi.ObjectSchema<TEntity> | (() => Joi.ObjectSchema<TEntity>)
): EndpointMiddleware;
export function ValidateBody<TEntity extends {}>(
  schema: Joi.ObjectSchema<TEntity> | (() => Joi.ObjectSchema<TEntity>)
): ControllerMiddleware;

// Validating other types
export function ValidateBody(schema: Joi.AnySchema | (() => Joi.AnySchema)): EndpointMiddleware;
export function ValidateBody(schema: Joi.AnySchema | (() => Joi.AnySchema)): ControllerMiddleware;
// Implementation

export function ValidateBody(schema: Joi.AnySchema | (() => Joi.AnySchema)): any {
  return Middleware(function (ctx, next) {
    const body = ctx.request.body;
    const resolvedSchema = typeof schema == 'function' ? schema() : schema;

    const { error, value } = resolvedSchema.validate(body);

    if (error) ctx.throw(400, `Validation error: ${error.message}`);

    ctx.request.body = value;
    next();
  });
}
