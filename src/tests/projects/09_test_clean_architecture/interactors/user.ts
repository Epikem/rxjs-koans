import { User, UserList } from "../entities";

// TODO: update to cover complex error logic
export type DataUpdateResult = Boolean;

export interface IUserInputPort {
  registerUser(userName: string): DataUpdateResult;
  getUserList(): UserList;
  getUserListByName(name: string): UserList;
  updateUser(userId: string, user: User): DataUpdateResult;
  deleteUser(userId: string): DataUpdateResult;
  deleteUserByName(name: string): DataUpdateResult;
}

export interface IUserDataAccess {
  addUser(user: User): DataUpdateResult;
  getUserList(): UserList;
  getUserListByName(name: string): UserList;
  updateUser(userId: string, user: User): DataUpdateResult;
  deleteUser(userId: string): DataUpdateResult;
  deleteUserByName(name: string): DataUpdateResult;
  generateUserId(): string;
}

export class UserInteractor implements IUserInputPort {
  constructor(public userDataAccess: IUserDataAccess) { }

  // register new user
  registerUser(userName: string): DataUpdateResult {
    const conflict = this.userDataAccess.getUserListByName(userName).users.length > 0;
    if (conflict) {
      return false;
    }
    const userId = this.userDataAccess.generateUserId();
    return this.userDataAccess.addUser(new User(userName, userId));
  }

  // get all users
  getUserList(): UserList {
    return this.userDataAccess.getUserList();
  }

  // get users by name
  getUserListByName(name: string): UserList {
    return this.userDataAccess.getUserListByName(name);
  }

  // update user
  updateUser(userId: string, user: User): DataUpdateResult {
    return this.userDataAccess.updateUser(userId, user);
  }

  // delete user
  deleteUser(userId: string): DataUpdateResult {
    return this.userDataAccess.deleteUser(userId);
  }

  deleteUserByName(name: string): DataUpdateResult {
    return this.userDataAccess.deleteUserByName(name);
  }
}

interface UserOutputPort {
  name: string;
  id: string;
}
