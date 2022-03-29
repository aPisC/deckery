// User model

export interface UserAttributes {
  id: number;
  email: string;
  username: string;
  name: string;
  password: string;
  groupId: number;
}

export interface UserCreateAttributes
  extends Omit<UserAttributes, "id" | "groupId"> {}

// Group model

export interface GroupAttributes {
  id: number;
  name: string;
}

export interface GroupCreateAttributes extends Omit<GroupAttributes, "id"> {}

// Authority model

export interface AuthorityAttributes {
  id: number;
  groupId: number;
  authority: string;
}

export interface AuthorityCreateAttributes
  extends Omit<AuthorityAttributes, "id"> {}
