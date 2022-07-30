import { User } from "./user";

// Pure entity: UserList
export class UserList {
  constructor(public users: User[]) { }
}
