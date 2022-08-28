import { createClient, RedisClientType, RedisFunctions, RedisModules, RedisScripts } from "redis";
import { from, fromEvent, mergeMap, Observable, of } from "rxjs";
import { Err, Ok, Result } from "ts-results";
import { User } from "../entity";
import { DataUpdateResult, IUserDataAccess } from "../interactor";
import { NameConflictError, UserNotFoundError } from "../util";

const REDIS_HOST = 'redis://default:redispw@localhost:55000';

export class RxRedis {
  protected client: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;
  // protected rxConnect:

  constructor() {
    console.log('rxredis constructing');
    this.client = createClient({
      url: REDIS_HOST,
    });

    // async init
    (async () => {
      console.log('this.client connecting');

      // this.client.on('connect', () => {
      //   throw new Error('should not be called');
      // });

      // this.client.on('error', (err: any) => {
      //   throw new Error("redis error: " + err);
      // });

      // await this.client.connect();
    })();
  }

  protected connect$() {
    const rxConnect$ = fromEvent(this.client, 'connect') as Observable<void>;

    const rxError$ = fromEvent(this.client, 'error') as Observable<void>;

    return new Observable(subscriber => {
      rxConnect$.subscribe(() => {
        console.log('connected');
        subscriber.next(true);
        subscriber.complete();
      });
      rxError$.subscribe(err => {
        subscriber.error(err);
      });
      this.client.connect();
    });
  }

  protected set$(key: string, value: string) {
    return from(this.client.set(key, value));
  };

  protected get$(key: string) {
    return from(this.client.get(key));
  }
}

const USER_KEY_PREFIX = 'user:';

export class RedisUserRepository extends RxRedis implements IUserDataAccess {
  constructor() {
    super();
  }

  connect$(): Observable<Result<RedisUserRepository, Error>> {
    return new Observable(subscriber => {
      super.connect$().subscribe({
        next: () => {
          console.log('connected!');
          subscriber.next(Ok(this));
          subscriber.complete();
        }
      });
    });
  }

  redisSet$(key: string, value: string): Observable<Result<Boolean, Error>> {
    return super.set$(key, value).pipe(
      mergeMap((result) => {
        if (result === 'OK') {
          return of(Ok(true));
        } else {
          return of(Err(new Error('set failed')));
        }
      }
    ));
  }

  redisGet$(key: string): Observable<Result<string, Error>> {
    return super.get$(key).pipe(
      mergeMap((result) => {
        if (result) {
          return of(Ok(result));
        } else {
          return of(Err(new Error('get failed')));
        }
      }
    ));
  }

  persist$(user: User): DataUpdateResult<NameConflictError> {
    // not implemented
    throw new Error("not implemented");
  }

  getList$(): Observable<User[]> {
    // not implemented
    throw new Error("not implemented");
  }

  getListByName$(name: string): Observable<User[]> {
    // not implemented
    throw new Error("not implemented");
  }

  update$(userId: string, user: User): DataUpdateResult<UserNotFoundError> {
    // not implemented
    throw new Error("not implemented");
  }

  generateId(): string {
    // not implemented
    throw new Error("not implemented");
  }

  deleteByName$(name: string): Observable<Ok<boolean> | Err<UserNotFoundError>> {
    // not implemented
    throw new Error("not implemented");
  }

  delete$(userId: string): DataUpdateResult<UserNotFoundError> {
    // not implemented
    throw new Error("not implemented");
  }
}