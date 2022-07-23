import { expect } from "chai";
import { Observable } from "rxjs";
const ___ = "fill this with correct answer";
const list: Array<string> = new Array();

const observable$ = new Observable<string>(subscriber => {
    setInterval(() => {
        subscriber.next(___);
    }, 1500);

    setTimeout(() => {
        // uncomment below line and change ___ to correct method
        // subscriber.___();
    }, 5000);
});

export default function (done: Mocha.Done) {
    let count = 0;
    console.log('before subscribe');
    observable$.subscribe({
        next(item) {
            console.log('received value:' + item);
            list.push(item);
        },
        error(err) {
            console.error('err:', err);
        },
        complete() {
            console.log('done');
            expect(list).to.have.length.greaterThan(3);
            expect(list).to.include.members(['hi']);
            done();
        }
    });
    console.log('after subscribe');
}
