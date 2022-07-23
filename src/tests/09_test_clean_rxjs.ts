import { expect } from "chai";
import { interval, map, Observable, zip } from "rxjs";
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
    constructor(public name: string) { }
}

// Pure entity: UserList
class UserList {
    constructor(public users: User[]) { }
}

// Pure entity: UserRepository
class UserRepository {
    constructor(public users: UserList) { }

    // get_user_list
    get_user_list(): UserList {
        return this.users;
    }

    get_user_list_by_name(name: string): UserList {
        return new UserList(this.users.users.filter(user => user.name === name));
    }
}

// pure business logic: get_user_list
function get_user_list(ur: UserRepository, query: string) {
    return ur.get_user_list_by_name(query);
}

// impure function: call_api
function call_api(query: string) {
    console.log(`searching results for "${query}"...`);
}

// impure function: query_db



export default function (done: Mocha.Done) {

}
