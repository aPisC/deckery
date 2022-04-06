import { AuthTypes } from '@deckery/common-interfaces';
import * as crypto from 'crypto';
import { Attributes, FindOptions, Op } from 'sequelize';
import { Optional } from 'sequelize';
import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UserAttributes, UserCreateAttributes } from './attributes';
import AuthorityModel from './authority.model';
import GroupModel from './group.model';
import UserGroupModel from './group.model';

@Table
export default class UserModel extends Model<UserAttributes, UserCreateAttributes> {
  @Column
  declare email: string;

  @Column
  declare username: string;

  @Column
  declare name: string;

  @Column({
    set: function (value: string) {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync(value, salt, 1000, 64, `sha512`).toString(`hex`);
      this.setDataValue('password', `${salt}:${hash}`);
    },
  })
  declare password: string;

  @Column({
    defaultValue: false,
  })
  declare isAdmin: boolean;

  @ForeignKey(() => UserGroupModel)
  declare groupId: number;

  @BelongsTo(() => GroupModel)
  declare group: GroupModel;
  declare getGroup: (options?: FindOptions<Attributes<GroupModel>>) => Promise<GroupModel>;

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

  public static async findByIdentifier(username: string, email: string): Promise<UserModel | null>;
  public static async findByIdentifier(identifier: string): Promise<UserModel | null>;
  public static async findByIdentifier(username: string, email?: string): Promise<UserModel | null> {
    return await UserModel.findOne({
      where: {
        [Op.or]: [{ username: username }, { email: email ?? username }],
      },
    });
  }

  public async toAuthUser(): Promise<AuthTypes.User> {
    return {
      authorities: (await this.getGroup({ include: AuthorityModel })).authorities.map((a) => a.authority),
      email: this.email,
      groupId: this.groupId,
      id: this.id,
      name: this.name,
      username: this.username,
    };
  }
}
