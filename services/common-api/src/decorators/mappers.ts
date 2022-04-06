import Koa from 'koa';
import 'reflect-metadata';

export namespace Map {
  const mappersSymbol = Symbol();

  export type MapperFunction<TValue> = (...args: any[]) => TValue;

  export function Mapper<TValue = any>(mapper: MapperFunction<TValue>): ParameterDecorator {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
      const mappers = Reflect.getOwnMetadata(mappersSymbol, target, propertyKey)?.slice() || [];
      Reflect.defineMetadata(mappersSymbol, mappers, target, propertyKey);

      while (mappers.length <= parameterIndex) mappers.push(null);
      mappers[parameterIndex] = mapper;
    };
  }

  export function Apply(): MethodDecorator {
    return (target, propertyKey, descriptor: PropertyDescriptor) => {
      // Resolve registered mappers
      const mappers: Array<Map.MapperFunction<any> | null> =
        Reflect.getOwnMetadata(mappersSymbol, target, propertyKey) || [];
      if (mappers.length == 0) return;

      // Fill empty mappers with original arguments
      let filledMappers = 0;
      for (let i = 0; i < mappers.length; i++) {
        if (mappers[i]) continue;

        const argId = filledMappers++;
        mappers[i] = (...args) => args[argId];
      }

      // Override function to resolve mappers
      const orig = descriptor.value;
      descriptor.value = function (...args: any) {
        const args2 = (<MapperFunction<any>[]>mappers).map((m) => m(...args));
        for (let i = filledMappers; i < args.length; i++) args2.push(args[i]);
        return orig.call(this, ...args2);
      };
    };
  }

  export const Ctx = () => Mapper((ctx) => ctx);
  export const Next = () => Mapper((ctx, next) => next);
  export const Request = () => Mapper((ctx) => ctx.request);
  export const Response = () => Mapper((ctx) => ctx.response);
  export const Body = () => Mapper((ctx) => ctx.request.body);
  export const State = () => Mapper((ctx) => ctx.state);
  export const User = () => Mapper((ctx) => ctx.state?.user);
  export const Query = () => Mapper((ctx) => ctx.request.query);
}
