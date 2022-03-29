import { Optional } from 'sequelize';
import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { GroupAttributes, GroupCreateAttributes } from './attributes';
import AuthorityModel from './authority.model';

@Table
export default class GroupModel extends Model<GroupAttributes, GroupCreateAttributes> implements GroupAttributes {
  @Column
  name: string = '';

  @Column({ defaultValue: false })
  isDefault: boolean = false;

  @HasMany(() => AuthorityModel)
  authorities: any[] = [];
}
