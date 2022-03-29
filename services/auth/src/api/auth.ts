import { Controller, Route, ValidateBody } from '@deckery/common/api';
import { AuthTypes } from '@deckery/common/types';
import Koa from 'koa';
import { Op } from 'sequelize';
import * as Jwt from 'jsonwebtoken';
import Joi from 'joi';
import { ServerContext } from '../server';
import UserModel from '../models/user.model';
import GroupModel from '../models/group.model';
import { config } from '../config';

export default class AuthController extends Controller {
  @Route.Get('/')
  async index() {
    return 'ok';
  }

  @Route.Post()
  @ValidateBody<AuthTypes.Register>(() => Joi.object() as any as Joi.ObjectSchema<AuthTypes.Register>)
  async register(ctx: ServerContext<AuthTypes.Register>, next: Koa.Next) {
    const userData = <AuthTypes.Register>ctx.request.body;

    const existingUser = await UserModel.findOne({
      where: {
        [Op.or]: [{ username: userData.username }, { email: userData.email }],
      },
    });
    if (existingUser) ctx.throw(403, 'User already exists');

    const [group] = await GroupModel.findOrCreate({
      where: {
        isDefault: true,
      },
      defaults: {
        name: 'default',
        isDefault: true,
      },
    });
    const user = await UserModel.create({
      email: userData.email,
      groupId: group.id,
      name: userData.name,
      password: userData.password,
      username: userData.username,
    });

    return this.createTokenData(user);
  }

  private createTokenData(user: UserModel) {
    const token = Jwt.sign({ id: user.id }, config.jwtSecret, {});
    return {
      jwt: token,
      user: user,
    };
  }
}
