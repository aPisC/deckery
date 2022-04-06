import Joi, { isSchema } from 'joi';
import 'reflect-metadata';
import { ApiError } from '../api-error';
import { EndpointMiddlewareDecorator } from '../types';
import { ControllerMiddleware, Middleware } from './middleware';

export namespace Validate {
  const validatorSymbol = Symbol();

  interface ValidatorRecord {
    index: number;
    validator: Validator;
  }

  function addValidator(target: Object, propertyKey: string | symbol, argIndex: number, validator: Validator) {
    const validators: ValidatorRecord[] = Reflect.getOwnMetadata(validatorSymbol, target, propertyKey)?.slice() || [];
    Reflect.defineMetadata(validatorSymbol, validators, target, propertyKey);
    validators.push({ index: argIndex, validator: validator });
  }

  export function Apply(): MethodDecorator {
    return (target, propertyKey, descriptor: PropertyDescriptor) => {
      const orig = descriptor.value;

      const validators: ValidatorRecord[] = Reflect.getOwnMetadata(validatorSymbol, target, propertyKey)?.slice() || [];

      descriptor.value = function (...args: any[]) {
        validators.forEach((v) => (v.index >= 0 ? v.validator(args[v.index]) : v.validator(...args)));

        return orig.call(this, ...args);
      };
    };
  }

  export function Joi(schema: Joi.AnySchema | (() => Joi.AnySchema)): ParameterDecorator {
    return (target: Object, propertyKey: string | symbol, parameterIndex) => {
      addValidator(target, propertyKey, parameterIndex, (data) => {
        if (typeof schema === 'function') schema = schema();
        const { error } = (<Joi.AnySchema>schema).validate(data);
        if (error) throw ApiError.asApiError(error, 401);
      });
    };
  }
}

export type Validator = (...args: any[]) => void;
