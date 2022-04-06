import { Optional } from 'sequelize';
import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { GroupAttributes, GroupCreateAttributes } from './attributes';
import AuthorityModel from './authority.model';

@Table
export default class GroupModel extends Model<GroupAttributes, GroupCreateAttributes> implements GroupAttributes {
  @Column
  declare name: string;

  @Column({ defaultValue: false })
  declare isDefault: boolean;

  @HasMany(() => AuthorityModel)
  declare authorities: AuthorityModel[];

  public static async getDefaultGroup(): Promise<GroupModel> {
    const [group] = await GroupModel.findOrCreate({
      where: {
        isDefault: true,
      },
      defaults: {
        name: 'default',
        isDefault: true,
      },
    });
    return group;
  }
}
