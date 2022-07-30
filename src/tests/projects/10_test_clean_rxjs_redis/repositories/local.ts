import { of, mergeMap, Observable, from } from 'rxjs';
import { User } from "../entities";
import { DataUpdateResult, IUserDataAccess } from "../interactors";

function userIdGenerator(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Pure entity: LocalUserRepository
export class LocalUserRepository implements IUserDataAccess {
  constructor(public users: User[]) { }

  // addUser(user: User): DataUpdateResult {
  //   const nameConflict = this.getUserListByName(user.name).users.find(u => u.name === user.name);
  //   if (nameConflict) {
  //     return false;
  //   }
  //   const id = userIdGenerator();
  //   const idConflict = this.users.users.find(u => u.id === id);
  //   if (idConflict) {
  //     return false;
  //   }
  //   this.users.users.push(user);
  //   return true;
  // }

  // make rxjs
  addUser$(user: User): DataUpdateResult {
    return this.getUserListByName$(user.name).pipe(
      mergeMap(userList => {
        const userId = userIdGenerator();
        // if userId or name is conflict, return false
        for (const u of userList) {
          if (u.id === userId || u.name === user.name) {
            return of(false);
          }
        }
        // if not conflict, add user
        this.users.push(user);
        return of(true);
      })
    )}

  getUserList$(): Observable<User[]> {
    return of(this.users);
  }

  getUserListByName$(name: string): Observable<User[]> {
    return of(this.users.filter(user => user.name === name));
  }

  generateUserId$(): Observable<string> {
    const userId = userIdGenerator();
    return of(this.users).pipe(
      mergeMap(users => {
        const conflict = users.find(u => u.id === userId);
        if (conflict) {
          return this.generateUserId$();
        }
        return of(userId);
      })
    )
  }

  // updateUser(userId: string, user: User): DataUpdateResult {
  //   const index = this.users.users.findIndex(u => u.id === userId);
  //   if (index === -1) {
  //     return false;
  //   }
  //   this.users.users[index] = user;
  //   return true;
  // }

  updateUser$(userId: string, user: User): void {
    const index = this.users.findIndex(u => u.id === userId);
    if (index === -1) {
      return;
    }
    this.users[index] = user;
  }


  deleteUser$(userId: string): DataUpdateResult {
    const index = this.users.users.findIndex(u => u.id === userId);
    if (index === -1) {
        return false;
    }
    this.users.users.splice(index, 1);
    return true;
  }

  deleteUserByName$(name: string): DataUpdateResult {
    const index = this.users.users.findIndex(u => u.name === name);
    if (index === -1) {
        return false;
    }
    this.users.users.splice(index, 1);
    return true;
  }
}