import { expect } from "chai";
import { count, Subject } from "rxjs";
import { sleep } from "../util";
const ___ = "fill this with correct answer";
const ____ = 0;

const list: Array<number> = new Array();
let total = 0;

export default async function () {
    const subject = new Subject<number>();
    
    subject.subscribe({
        next: v => console.log(`observer A: ${v}`)
    });

    subject.subscribe({
        next: v => console.log(`observer B: ${v}`)
    });

    subject.subscribe({
        next: v => console.log(`observer C: ${v}`)
    });

    const result = subject.pipe(count());
    result.subscribe(cnt=>{
        console.info(cnt);
        total += 1;
    });

    subject.next(1);
    subject.next(2);
    
    // subject.___();

    await sleep(1000);
    
    expect(total).to.equal(2);
}
