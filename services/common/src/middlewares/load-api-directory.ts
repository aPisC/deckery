import * as fs from 'fs';
import * as Router from 'koa-router';
import * as path from 'path';
import { Controller } from '../api';

interface ApiDirectoryOptions {
  path: string;
  prefix?: string;
}

const defaultOptions: Partial<ApiDirectoryOptions> = {
  prefix: '',
};

export function LoadApiDirectory(options: ApiDirectoryOptions): Router.IMiddleware[] {
  options = {
    ...defaultOptions,
    ...options,
  };
  const router = new Router({
    prefix: options.prefix || '',
  });

  fs.readdirSync(options.path)
    .filter((file) => file.indexOf('.') !== 0)
    .forEach((file) => {
      const api = require(path.join(options.path, file));
      const controller: any = new api.default();

      if (controller instanceof Controller) {
        const apiRouter: Router = controller.__router;
        router.use(apiRouter.routes());
      }
    });

  return [router.routes(), router.allowedMethods()];
}
