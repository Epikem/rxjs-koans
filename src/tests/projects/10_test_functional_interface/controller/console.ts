import readline from 'readline';
import { fromEvent, Observable } from 'rxjs';
import { IUserDataAccess, UserInteractor } from '../interactor';
import { IController, IRxController } from './base';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export class ConsoleController implements IRxController {
  private readonly routeMap: { [key: string]: ConsoleControllerRoute }
  constructor(
    private readonly userInteractor: UserInteractor,
    private readonly userDataAccess?: IUserDataAccess,
  ) {
    this.routeMap = getConsoleControllerRoutesMap(userInteractor);
    if (userDataAccess) {
      this.routeMap = {
        ...this.routeMap,
        ...getTestRoutesMap(userDataAccess),
      }
    }

    const routes = Object.keys(this.routeMap);
    this.routeMap['help'] = new ConsoleControllerRoute('help', () => {
      console.log('routes: ', routes);
    });
  }

  dispatch(command: string, payload: any) {
    const route = this.routeMap[command];
    if (route) {
      route.action(payload);
    } else {
      console.log(`command ${command} not found`);
    }
  }

  // run() {
  //   rl.on('line', (line) => {
  //     const [ command, ...payloads ] = line.split(' ');

  //     console.log(`command: ${command} payloads: ${payloads}`);
  //     // to dict
  //     const payload = payloads.reduce((acc: any, cur) => {
  //       const [key, value] = cur.split('=');
  //       acc[key] = value;
  //       return acc;
  //     }
  //     , {});

  //     this.dispatch(command, payload);
  //   });
  // }

  run$() {
    const line$ = fromEvent(rl, 'line') as Observable<string>;
    console.log('line$');
    return line$.subscribe((line) => {
      const [ command, ...payloads ] = line.split(' ');

      // to dict
      const payload = payloads.reduce((acc: any, cur) => {
        const [key, value] = cur.split('=');
        acc[key] = value;
        return acc;
      }
      , {});

      try {
        this.dispatch(command, payload);
      } catch (e) {
        console.error(e);
      }
    })
  }
}

class ConsoleControllerRoute {
  constructor(
    public readonly command: string,
    public readonly action: (payload: any) => void
  ) {}
}

function getConsoleControllerRoutesMap (userInteractor: UserInteractor) {
  return {
    'register': new ConsoleControllerRoute('register', (payload: any) => {
      const { name } = payload;
      userInteractor.registerUser$(name).subscribe((result) => {
        console.log(result);
      });
    }),
    'exit': new ConsoleControllerRoute('exit', (payload: any) => {
      console.log('exiting');
      process.exit(0);
    }),
    'list': new ConsoleControllerRoute('list', (payload: any) => {
      userInteractor.getUserList$().subscribe((result) => {
        console.log(result);
      });
    }),
    'list-by-name': new ConsoleControllerRoute('list-by-name', (payload: any) => {
      const { name } = payload;
      userInteractor.getUserListByName$(name).subscribe((result) => {
        console.log(result);
      });
    }),
    'delete': new ConsoleControllerRoute('delete', (payload: any) => {
      const { id } = payload;
      userInteractor.deleteUser$(id).subscribe((result) => {
        console.log(result);
      });
    }),
    'update': new ConsoleControllerRoute('update', (payload: any) => {
      const { id, name } = payload;
      userInteractor.updateUser$(id, { id, name }).subscribe((result) => {
        console.log(result);
      });
    }),
    // 'help': new ConsoleControllerRoute('help', () => {
    //   console.log('available commands: register, list, list-by-name, delete, update, exit');
    // }),
  }
}

function getTestRoutesMap (userDataAccess: IUserDataAccess) {
  return {
    'test-redis-set': new ConsoleControllerRoute('test-redis-set', (payload: any) => {
      const { key, value } = payload;
      if (userDataAccess.redisSet$) {
        userDataAccess.redisSet$(key, value).subscribe((result) => {
          console.log(result);
        });
      } else {
        console.info('redisSet$ is not supported');
      }
    }),
    'test-redis-get': new ConsoleControllerRoute('test-redis-get', (payload: any) => {
      const { key } = payload;
      if (userDataAccess.redisGet$) {
        userDataAccess.redisGet$(key).subscribe((result) => {
          console.log(result);
        });
      } else {
        console.info('redisGet$ is not supported');
      }
    }),
  }
}