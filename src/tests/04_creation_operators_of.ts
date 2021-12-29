import { expect } from "chai";
import { map, of } from "rxjs";
const ___ = "fill this with correct answer";
const list: Array<number> = new Array();

export default function (done: Mocha.Done) {
    of(1, 2)
        .pipe(map(x => x*x))
        .subscribe(v => {
            console.log(`value: ${v}`)
            list.push(v);
        });
    setTimeout(() => {
        expect(list).to.equals([1, 4, 9]);
        done();
    }, 1000);
}
