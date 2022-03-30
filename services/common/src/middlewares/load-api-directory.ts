import fs from 'fs';
import Router from 'koa-router';
import path from 'path';
import { Controller } from '../api';
import compose from 'koa-compose';

interface ApiDirectoryOptions {
  path: string;
  prefix?: string;
}

const defaultOptions: Partial<ApiDirectoryOptions> = {
  prefix: '',
};

export function LoadApiDirectory(options: ApiDirectoryOptions): Router.IMiddleware {
  options = {
    ...defaultOptions,
    ...options,
  };
  const router = new Router({
    prefix: options.prefix || '',
  });

  fs.readdirSync(options.path)
    .filter((file) => file.indexOf('.') !== 0)
    .filter((file) => file.endsWith('.js') || (file.endsWith('.ts') && !file.endsWith('.d.ts')))
    .forEach((file) => {
      try {
        console.log('Loading api controller from: ', file);
        const api = require(path.join(options.path, file));
        const controller: any = new api.default();

        if (controller instanceof Controller) {
          const apiRouter: Router = controller.__router;
          router.use(apiRouter.routes());
        }
      } catch {}
    });

  return compose([router.routes(), router.allowedMethods()]);
}
