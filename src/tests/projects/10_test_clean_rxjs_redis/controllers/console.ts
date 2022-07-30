import { IUserInputPort } from "../interactors";
import readline from 'readline';
import { User } from "../entities";

// read from console and calls action of other interactors
export class ConsoleController {
  constructor(public userAccess: IUserInputPort) { }

  // read from console and calls action of other interactors
  read_from_console(): void {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.on('line', (line) => {
      const [command, ...payloads] = line.split(' ');
      console.log(`command: ${command} payloads: ${payloads}`);
      // to dict
      const payload = payloads.reduce((acc: any, cur) => {
        const [key, value] = cur.split('=');
        acc[key] = value;
        return acc;
      }, {});

      switch (command) {
        case "register":
          this.userAccess.registerUser$(payload.name)
            .subscribe(
              (result) => {
                console.log(`register ${payload.name} ${result ? "success" : "fail"}`)
              }
            );
          break;
        case "list":
          console.log(this.userAccess.getUserList$());
          break;
        case "list-by-name":
          console.log(this.userAccess.getUserListByName$(payload.name));
          break;
        case "update":
          const [userId, newName] = line.split(" ");
          console.log(`${userId} ${newName}`);
          this.userAccess.updateUser$(userId, new User(newName, userId));
          break;
        case "delete":
          if (payload.id) {
            console.log(`deleting user with id ${payload.id}`);
            this.userAccess.deleteUser$(payload.id);
          } else if (payload.name) {
            console.log(`deleting user with name ${payload.name}`);
            this.userAccess.deleteUserByName$(payload.name);
          }
          break;
        case "exit":
          rl.close();
          break;
        default:
          console.log("Unknown command");
          break;
      }
    });
  }
}