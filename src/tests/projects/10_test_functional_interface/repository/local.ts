import { mergeMap, Observable, of } from "rxjs";
import { Err, Ok } from "ts-results";
import { User } from "../entity";
import { DataUpdateResult, IUserDataAccess } from "../interactor";
import { UserNotFoundError, NameConflictError } from "../util";

function userIdGenerator() {
  return Math.random().toString(36).slice(-8);
}

export class LocalUserRepository implements IUserDataAccess {
  constructor(public users: User[]) { }
  deleteByName$(name: string) {
    return this.getListByName$(name).pipe(
      mergeMap(users => {
        if (users.length === 0) {
          return of(Err(new UserNotFoundError()));
        }
        this.users = this.users.filter(user => user.name !== name);
        return of(Ok(true));
      })
    )
  }

  generateId(): string {
    return userIdGenerator();
  }

  persist$(user: User): DataUpdateResult<NameConflictError> {
    return this.getList$().pipe(
      mergeMap(users => {
        if (users.find(u => u.name === user.name)) {
          return of(Err(new NameConflictError()));
        }
        this.users.push(user);
        return of(Ok(true));
      })
    )
  }

  getList$(): Observable<User[]> {
    return of(this.users);
  }

  getListByName$(name: string): Observable<User[]> {
    return of(this.users.filter(user => user.name === name));
  }

  update$(userId: string, user: User): DataUpdateResult<UserNotFoundError> {
    return this.getList$().pipe(
      mergeMap(users => {
        if (!users.find(u => u.id === userId)) {
          return of(Err(new UserNotFoundError()));
        }
        this.users = this.users.map(u => u.id === userId ? user : u);
        return of(Ok(true));
      })
    )
  }

  delete$(userId: string): DataUpdateResult<UserNotFoundError> {
    return this.getList$().pipe(
      mergeMap(users => {
        if (!users.find(u => u.id === userId)) {
          return of(Err(new UserNotFoundError()));
        }
        this.users = this.users.filter(u => u.id !== userId);
        return of(Ok(true));
      })
    )
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
}
