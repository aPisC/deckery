import { Optional } from "sequelize";
import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { AuthorityAttributes, AuthorityCreateAttributes } from "./attributes";
import UserGroupModel from "./group.model";

@Table({
  createdAt: false,
  updatedAt: false,
})
export default class AuthorityModel
  extends Model<AuthorityAttributes, AuthorityCreateAttributes>
  implements AuthorityAttributes
{
  @Column
  id: number = 0;

  @Column
  authority: string = "";

  @ForeignKey(() => UserGroupModel)
  @Column
  groupId: number = 0;
}
