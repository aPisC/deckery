// User model

export interface UserAttributes {
  id?: number | any;
  email: string;
  username: string;
  name: string;
  password: string;
  groupId: number;
}

export interface UserCreateAttributes extends Omit<UserAttributes, 'id'> {}

// Group model

export interface GroupAttributes {
  id?: number | any;
  name: string;
  isDefault: boolean;
}

export interface GroupCreateAttributes extends Omit<GroupAttributes, 'id'> {}

// Authority model

export interface AuthorityAttributes {
  id?: number | any;
  authority: string;
  groupId: any;
}

export interface AuthorityCreateAttributes extends Omit<AuthorityAttributes, 'id'> {}
