import { Controller } from '@deckery/common-api';
import { Route, ValidateBody } from '@deckery/common-api/decorators';
import { AuthTypes } from '@deckery/common-interfaces';
import Koa from 'koa';
import { Op } from 'sequelize';
import * as Jwt from 'jsonwebtoken';
import Joi from 'joi';
import { ServerContext } from '../server';
import UserModel from '../models/user.model';
import GroupModel from '../models/group.model';
import { config } from '../config';

export default class AuthController extends Controller {
  @Route.Post('/login')
  @ValidateBody<AuthTypes.Login>(
    Joi.object({
      identifier: Joi.string().required(),
      password: Joi.string().required(),
    }).required()
  )
  async login(ctx: ServerContext<AuthTypes.Login>, next: Koa.Next) {
    const { identifier, password } = <AuthTypes.Login>ctx.request.body;

    const user = await UserModel.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { email: identifier }],
      },
    });

    if (!user || !user.validatePassword(password)) ctx.throw(403, 'Identifier or password is incorrect!');

    return this.createTokenData(user);
  }

  @Route.Post()
  //@ValidateBody("email", Joi.string().email().required())
  @ValidateBody<AuthTypes.Register>(() =>
    Joi.object({
      email: Joi.string().email().required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string(),
    }).required()
  )
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
