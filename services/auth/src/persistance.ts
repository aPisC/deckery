import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import UserModel from './models/user.model';
import GroupModel from './models/group.model';
import AuthorityModel from './models/authority.model';
import { randomString } from '@deckery/common/utils';
import Authorities from '@deckery/common/authorities';
import path from 'path';

export async function bootstrap(options: SequelizeOptions) {
  const sequelize = new Sequelize(options);
  await sequelize.authenticate();
  await sequelize.sync();

  await initData();

  return sequelize;
}

async function initData() {
  if (!(await GroupModel.findOne())) {
    // Create default group
    await GroupModel.create({
      name: 'default',
      isDefault: true,
    });

    // Create admin group with authorities
    const adminGroup = await GroupModel.create({
      name: 'admin',
      isDefault: false,
    });

    await AuthorityModel.create({
      authority: Authorities.ReadAuthorization,
      groupId: adminGroup.id,
    });

    await AuthorityModel.create({
      authority: Authorities.EditAuthorization,
      groupId: adminGroup.id,
    });

    // Create default admin user
    const password = randomString(12);
    await UserModel.create({
      name: 'Admin',
      email: '',
      username: 'admin',
      password: password,
      groupId: adminGroup.id,
    });

    console.log('Created default admin user with password: ', password);
  }
}
