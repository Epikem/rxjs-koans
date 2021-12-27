import { expect } from "chai";
import { Observable } from "rxjs";
const ___ = "fill this with correct answer";
const map: Array<string> = new Array();

const observable = new Observable<string>(subscriber => {
    subscriber.next('apple');
    subscriber.next('orange');
    subscriber.next('banana');
    setTimeout(() => {
        subscriber.next(___);
        subscriber.complete();
    }, 1000);
});

export default function () {
    console.log('before subscribe');
    observable.subscribe({
        next(item) {
            console.log('received value ' + item);
            map.push(item)
        },
        error(err) {
            console.error('err:', err);
        },
        complete() {
            console.log('done');
            expect(map).to.include.members(['apple', 'orange', 'banana', 'pineapple']);
        }
    });
    console.log('after subscribe');
}
