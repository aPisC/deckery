import * as fs from "fs";
import * as Koa from "koa";
import * as Router from "koa-router";
import * as path from "path";
import "reflect-metadata";

const baseName = path.basename(__filename);

export function applyApiMiddleware(app: Koa): void {
  const router = new Router({
    prefix: ``,
  });

  fs.readdirSync(__dirname)
    .filter((file) => file.indexOf(".") !== 0 && file !== baseName)
    .forEach((file) => {
      const api = require(path.join(__dirname, file));
      const controller = new api.default();

      const apiRouter: Router = Reflect.getMetadata(
        "controller.router",
        controller
      );

      router.use(apiRouter.routes());
    });

  app.use(router.routes()).use(router.allowedMethods());
}
