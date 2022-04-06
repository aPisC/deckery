import { ApiError, Controller, RequestContext } from '@deckery/common-api';
import { Route, ValidateBody, Map, Validate } from '@deckery/common-api/decorators';
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
  async login(
    @Map.Body()
    @Validate.Joi(() => loginSchema)
    { identifier, password }: AuthTypes.Login
  ): Promise<AuthTypes.AuthData> {
    const user = await UserModel.findByIdentifier(identifier);
    if (!user || !user.validatePassword(password)) throw new ApiError.Forbidden('Identifier or password is incorrect!');

    return createTokenData(await user.toAuthUser());
  }

  @Route.Post('/register')
  async register(
    @Map.Body()
    @Validate.Joi(() => registerSchema)
    userData: AuthTypes.Register
  ): Promise<AuthTypes.AuthData> {
    if (await UserModel.findByIdentifier(userData.username, userData.email))
      throw new ApiError.Forbidden('User already exists');

    const group = await GroupModel.getDefaultGroup();
    const user = await UserModel.create({
      groupId: group.id,
      ...userData,
    });

    return createTokenData(await user.toAuthUser());
  }

  @Route.Post('/renew')
  async renew(@Map.User() { id }: AuthTypes.User): Promise<AuthTypes.AuthData> {
    const user = await UserModel.findOne({ where: { id: id } });
    if (!user) throw new ApiError.Internal('User not found');

    return createTokenData(await user.toAuthUser());
  }
}

function createTokenData(user: AuthTypes.User): AuthTypes.AuthData {
  return {
    jwt: Jwt.sign(user, config.jwtSecret, {}),
    user: user,
  };
}

const loginSchema = Joi.object({
  identifier: Joi.string().required(),
  password: Joi.string().required(),
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  name: Joi.string(),
});
