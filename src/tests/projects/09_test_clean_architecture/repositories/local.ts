import { User, UserList } from "../entities";
import { DataUpdateResult, IUserDataAccess } from "../interactors";

function userIdGenerator(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Pure entity: LocalUserRepository
export class LocalUserRepository implements IUserDataAccess {
  constructor(public users: UserList) { }

  addUser(user: User): DataUpdateResult {
    const nameConflict = this.getUserListByName(user.name).users.find(u => u.name === user.name);
    if (nameConflict) {
      return false;
    }
    const id = userIdGenerator();
    const idConflict = this.users.users.find(u => u.id === id);
    if (idConflict) {
      return false;
    }
    this.users.users.push(user);
    return true;
  }

  getUserList(): UserList {
    return this.users;
  }

  getUserListByName(name: string): UserList {
    return new UserList(this.users.users.filter(user => user.name === name));
  }

  generateUserId(): string {
    const userId = userIdGenerator();
    const conflict = this.users.users.find(u => u.id === userId);
    if (conflict) {
      return this.generateUserId();
    }
    return userId;
  }

  updateUser(userId: string, user: User): DataUpdateResult {
    const index = this.users.users.findIndex(u => u.id === userId);
    if (index === -1) {
      return false;
    }
    this.users.users[index] = user;
    return true;
  }

  deleteUser(userId: string): DataUpdateResult {
    const index = this.users.users.findIndex(u => u.id === userId);
    if (index === -1) {
        return false;
    }
    this.users.users.splice(index, 1);
    return true;
  }

  deleteUserByName(name: string): DataUpdateResult {
    const index = this.users.users.findIndex(u => u.name === name);
    if (index === -1) {
        return false;
    }
    this.users.users.splice(index, 1);
    return true;
  }
}