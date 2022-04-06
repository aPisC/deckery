export namespace AuthTypes {
  export interface Register {
    email: string;
    username: string;
    name: string;
    password: string;
  }

  export interface Login {
    identifier: string;
    password: string;
  }

  export interface User {
    id: number;
    email: string;
    username: string;
    name: string;
    authorities: string[];
    groupId: number;
  }

  export interface AuthData {
    jwt: string;
    user: User;
  }
}
