import { expect } from "chai";
import { interval, map, Observable, zip } from "rxjs";
const ___ = "fill this with correct answer";
const ____ = 0;

// you are making an autocomplete feature.
// you have to make sure that the client does not make too many requests
// also you have to make sure last request is processed.

const words = ['which operator will you use?', 'make sure last request is processed.'];

let count = 0;
let lastvalue = '';

function call_api(query: string) {
    console.log(`searching results for "${query}"...`);
    count += 1;
    lastvalue = query;
}

export default function (done: Mocha.Done) {
    const requests$ = new Observable<string>(subscriber => {
        let cur = '';
        for (const word of words[0]) {
            for (const ch of word) {
                cur += ch;
                subscriber.next(cur);
            }
        }

        setTimeout(() => {
            subscriber.next(cur);
            cur = '';
            for (const word of words[1]) {
                for (const ch of word) {
                    cur += ch;
                    subscriber.next(cur);
                }
            }
        }, 2000);

        setTimeout(() => {
            subscriber.complete();
        }, 4000);
    })

    const interval$ = interval(30);

    const limitedRequests$ = zip(requests$, interval$).pipe(
        map(([val, _]) => val),
        // ___(____),
    )

    limitedRequests$.subscribe({
        next(item) {
            call_api(item);
        },
        complete() {
            expect(count).to.greaterThan(1);
            expect(count).to.lessThan(15);
            expect(lastvalue).to.equal(words[1]);
            done();
        },
    });
    
}
