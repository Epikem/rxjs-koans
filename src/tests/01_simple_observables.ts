import { expect } from "chai";
import { Observable } from "rxjs";
const ___ = "fill this with correct answer";
const list: Array<string> = new Array();

const observable = new Observable<string>(subscriber => {
    subscriber.next('apple');
    subscriber.next('orange');
    subscriber.next('banana');
    setTimeout(() => {
        subscriber.next(___);
        subscriber.complete();
    }, 1000);
});

export default function (done: Mocha.Done) {
    console.log('before subscribe');
    observable.subscribe({
        next(item) {
            console.log('received value ' + item);
            list.push(item)
        },
        error(err) {
            console.error('err:', err);
        },
        complete() {
            console.log('done');
            expect(list).to.include.members(['apple', 'orange', 'banana', 'pineapple']);
            done();
        }
    });
    console.log('after subscribe');
}
