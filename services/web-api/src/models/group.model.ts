import { Optional } from "sequelize";
import { Column, HasMany, Model, Table } from "sequelize-typescript";
import { GroupAttributes, GroupCreateAttributes } from "./attributes";
import UserPermissionModel from "./authority.model";

@Table
export default class UserGroupModel
  extends Model<GroupAttributes, GroupCreateAttributes>
  implements GroupAttributes
{
  @Column
  id: number = 0;

  @Column
  name: string = "";

  @HasMany(() => UserPermissionModel)
  authorities?: UserPermissionModel;
}
