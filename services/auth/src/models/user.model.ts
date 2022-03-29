import * as crypto from 'crypto';
import { Optional } from 'sequelize';
import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UserAttributes, UserCreateAttributes } from './attributes';
import UserGroupModel from './group.model';

@Table
export default class UserModel extends Model<UserAttributes, UserCreateAttributes> {
  @Column
  email: string = '';

  @Column
  username: string = '';

  @Column
  name: string = '';

  @Column({
    set: function (value: string) {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync(value, salt, 1000, 64, `sha512`).toString(`hex`);
      this.setDataValue('password', `${salt}:${hash}`);
    },
  })
  password: string = '';

  @Column({
    defaultValue: false,
  })
  isAdmin: boolean = false;

  @ForeignKey(() => UserGroupModel)
  groupId: number = 0;

  public validatePassword(value: string): boolean {
    const [salt, orig_hash] = this.password.split(':');
    const hash = crypto.pbkdf2Sync(value, salt, 1000, 64, `sha512`).toString(`hex`);
    return hash === orig_hash;
  }

  public toJSON() {
    return {
      ...super.toJSON(),
      password: undefined,
    };
  }
}
