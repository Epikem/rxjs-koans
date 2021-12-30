import { expect } from "chai";
import { Observable } from "rxjs";
const ___ = "fill this with correct answer";
const list: Array<string> = new Array();

const observable$ = new Observable<string>(subscriber => {
    setInterval(() => {
        subscriber.next('orange');
    }, 1000);
    setTimeout(() => {
        subscriber.error('you should not receive this error');
    }, 4000);
});

export default function (done: Mocha.Done) {
    const timeout = setTimeout(() => {
        expect(list).to.have.length(3);
        done();
    }, 5000);

    const subscription = observable$.subscribe({
        next(item) {
            list.push(item);
            console.log(`got new orange. now have ${list.length} oranges`);

            if(list.length >= 3) {
                // uncomment below line and change ___ to correct method
                // subscription.___();
            }
        },
        error(err) {
            console.error('received error:', err);
            clearTimeout(timeout);
            throw err;
        },
        complete() {
            console.error('should not receive this');
            clearTimeout(timeout);
            throw new Error();
        }
    });
    


}
