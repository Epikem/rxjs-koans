import { Observable } from "rxjs";
import { Result } from "ts-results";
import { User } from "../entity";
import { NameConflictError, UserNotFoundError } from "../util";

export type DataUpdateResult<ErrorType> = Observable<Result<Boolean, ErrorType>>;

export interface IUserInputPort {
  registerUser$(userName: string): DataUpdateResult<UserNotFoundError>;
  getUserList$(): Observable<User[]>;
  getUserListByName$(name: string): Observable<User[]>;
  updateUser$(userId: string, user: User): DataUpdateResult<UserNotFoundError>;
  deleteUser$(userId: string): DataUpdateResult<UserNotFoundError>;
  deleteUserByName$(name: string): DataUpdateResult<UserNotFoundError>;
}

export interface IUserDataAccess {
  persist$(user: User): DataUpdateResult<NameConflictError>;
  getList$(): Observable<User[]>;
  getListByName$(name: string): Observable<User[]>;
  update$(userId: string, user: User): DataUpdateResult<UserNotFoundError>;
  delete$(userId: string): DataUpdateResult<UserNotFoundError>;
  deleteByName$(name: string): DataUpdateResult<UserNotFoundError>;
  generateId(): string;
  redisSet$?(key: string, value: string): Observable<Result<Boolean, Error>>;
  redisGet$?(key: string): Observable<Result<string, Error>>;
}

export class UserInteractor implements IUserInputPort {
  constructor(public userDataAccess: IUserDataAccess) { }

  registerUser$(userName: string): DataUpdateResult<UserNotFoundError> {
    return this.userDataAccess.persist$(new User(userName, this.userDataAccess.generateId()));
  }

  getUserList$(): Observable<User[]> {
    return this.userDataAccess.getList$();
  }

  getUserListByName$(name: string): Observable<User[]> {
    return this.userDataAccess.getListByName$(name);
  }

  updateUser$(userId: string, user: User): DataUpdateResult<UserNotFoundError> {
    return this.userDataAccess.update$(userId, user);
  }

  deleteUser$(userId: string): DataUpdateResult<UserNotFoundError> {
    return this.userDataAccess.delete$(userId);
  }

  deleteUserByName$(name: string): DataUpdateResult<UserNotFoundError> {
    return this.userDataAccess.deleteByName$(name);
  }
}
