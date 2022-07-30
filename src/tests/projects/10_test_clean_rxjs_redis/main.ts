import { ConsoleController } from "./controllers";
import { UserList } from "./entities";
import { UserInteractor } from "./interactors";
import { LocalUserRepository } from "./repositories";

// main. bootstrap the application and start the application.
export class Main {
  userInteractor: any;
  consoleController: any;
  constructor() { }

  // main application
  run() {
    if (!this.userInteractor) {
      const userRepository = new LocalUserRepository(new UserList([]));
      this.userInteractor = new UserInteractor(userRepository);
    }
    if (!this.consoleController) {
      this.consoleController = new ConsoleController(this.userInteractor);
    }
    this.consoleController.read_from_console();
  }
}