import { mergeMap, of } from "rxjs";
import { ConsoleController } from "./controller";
import { UserInteractor } from "./interactor";
import { RedisUserRepository, LocalUserRepository } from "./repository";

// main. bootstrap the application and start the application.
export class Main {
  userInteractor!: UserInteractor;
  consoleController!: ConsoleController;
  constructor() { }

  // // main application
  // run() {
  //   if (!this.userInteractor) {
  //     // const userRepository = new LocalUserRepository([]);
  //     // this.userInteractor = new UserInteractor(userRepository);
  //     const redisUserRepository = new RedisUserRepository();
  //     this.userInteractor = new UserInteractor(redisUserRepository);
  //   }
  //   if (!this.consoleController) {
  //     this.consoleController = new ConsoleController(this.userInteractor);
  //   }
  //   this.consoleController.run();
  // }

  run$() {
    const redisUserRepository = new RedisUserRepository();
    return redisUserRepository.connect$().pipe(
      mergeMap((connectedRedisUserRepository) => {
        if (connectedRedisUserRepository.err) {
          console.error(connectedRedisUserRepository.stack);
          throw new Error('failed to connect to redis');
        }

        this.userInteractor = new UserInteractor(connectedRedisUserRepository.val);
        this.consoleController = new ConsoleController(this.userInteractor, connectedRedisUserRepository.val);
        this.consoleController.run$();

        return of(true);
      })
    );
  }
}
