import { expect } from "chai";
import { interval, map, Observable, zip, bindNodeCallback, fromEvent, take } from "rxjs";
import readline from 'readline';

const ___ = "fill this with correct answer";
const ____ = 0;

// example of clean architecture on RxJS

// there are multiple side-effects:
// 1. call_api
// 2. query_db
// 3. console_io
// so we need to separate them from pure logic

// pure entity: User
class User {
    constructor(public name: string, public id: string) { }
}

// Pure entity: UserList
class UserList {
    constructor(public users: User[]) { }
}

// TODO: update to cover complex error logic
type DataUpdateResult = Boolean;

interface IUserDataAccess {
    add_user(user: User): DataUpdateResult;
    get_user_list(): UserList;
    get_user_list_by_name(name: string): UserList;
    update_user(userId: string, user: User): DataUpdateResult;
    delete_user(user: User): DataUpdateResult;
}

// Pure entity: LocalUserRepository
class LocalUserRepository implements IUserDataAccess {
    constructor(public users: UserList) { }

    // add_user
    add_user(user: User): DataUpdateResult {
        this.users.users.push(user);
        return true;
    }

    // get_user_list
    get_user_list(): UserList {
        return this.users;
    }

    get_user_list_by_name(name: string): UserList {
        return new UserList(this.users.users.filter(user => user.name === name));
    }

    // update_user
    update_user(userId: string, user: User): DataUpdateResult {
        const index = this.users.users.findIndex(u => u.id === userId);
        if (index === -1) {
            return false;
        }
        this.users.users[index] = user;
        return true;
    }

    // delete_user
    delete_user(user: User): DataUpdateResult {
        const index = this.users.users.findIndex(u => u.id === user.id);
        if (index === -1) {
            return false;
        }
        this.users.users.splice(index, 1);
        return true;
    }
}

function userIdGenerator(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

class UserInteractor {
    constructor(public userDataAccess: IUserDataAccess) { }

    // register new user
    register(name: string): User {
        const user = new User(name, "user_" + name);
        this.userDataAccess.add_user(user);
        return user;
    }
}

// read from console and calls action of other interactors
class ConsoleActionInterfactor {
    constructor (public userInteractor: UserInteractor) { }

    // read from console and calls action of other interactors
    read_and_call_action(action: string, userId: string, name: string): void {
        switch (action) {
            case "register":
                const user = this.userInteractor.register(name);
                console.log(`User ${user.name} with id ${user.id} registered`);
                break;
            case "update":
                const user = new User(name, userId);
                this.userInteractor.userDataAccess.update_user(userId, user);
                console.log(`User ${user.name} with id ${user.id} updated`);
                break;
            case "delete":
                const user = new User(name, userId);
                this.userInteractor.userDataAccess.delete_user(user);
                console.log(`User ${user.name} with id ${user.id} deleted`);
                break;
            case "list":
                const userList = this.userInteractor.userDataAccess.get_user_list();
                console.log(`User list: ${userList.users.map(u => u.name).join(", ")}`);
                break;
            case "list_by_name":
                const userList = this.userInteractor.userDataAccess.get_user_list_by_name(name);
                console.log(`User list by name: ${userList.users.map(u => u.name).join(", ")}`);
                break;
            default:
                console.log("Unknown action");
                break;
        }
    }
}

// main. bootstrap the application and start the application.
class Main {
    constructor(public userInteractor: UserInteractor, public consoleActionInterfactor: ConsoleActionInterfactor) { }

    // main application
    run() {
        this.userInteractor.register("John");
        this.userInteractor.register("Jane");
        this.consoleActionInterfactor.


// pure business logic: get_user_list
function get_user_list(ur: LocalUserRepository) {
    return ur.get_user_list();
}

// pure business logic: get_user_list_by_name
function get_user_list_by_name(ur: LocalUserRepository, query: string) {
    return ur.get_user_list_by_name(query);
}

// impure function: call_api
function call_api(query: string) {
    console.log(`searching results for "${query}"...`);
}

// impure function: query_db

// impure function: get console input
function get_console_input() {
    return prompt("Enter your query");
}

const console_interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export default function (done: Mocha.Done) {
    console.log('started');

    // console_interface.on('line', (line: string) => {
    //     console.log(`received: ${line}`);
    // });

    // 'on'
    const readConsoleLine$ = fromEvent(console_interface, 'line') as Observable<string>;
    // const readConsole = readConsoleLine$.subscribe((line) => {
    //     console.log(`received: ${line}`);
    // });

    // read console line once
    const readConsoleLineOnce$ = readConsoleLine$.pipe(
        take(1)
    );

    const readConsoleLineOnce = () => {
        console.log('read console line once');
        return readConsoleLineOnce$.subscribe({
            next: (line) => {
                console.log(`received: ${line}`);
            }
        });
    };

    readConsoleLineOnce();
}
