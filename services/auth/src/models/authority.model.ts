import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { AuthorityAttributes, AuthorityCreateAttributes, GroupAttributes } from './attributes';
import GroupModel from './group.model';

@Table({
  createdAt: false,
  updatedAt: false,
})
export default class AuthorityModel
  extends Model<AuthorityAttributes, AuthorityCreateAttributes>
  implements AuthorityAttributes
{
  @Column
  authority: string = '';

  @ForeignKey(() => GroupModel)
  groupId: any;

  @BelongsTo(() => GroupModel)
  group?: GroupAttributes;
}
