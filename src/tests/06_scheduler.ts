import { expect } from "chai";
import { asapScheduler, asyncScheduler } from "rxjs";
import { sleep } from "../util";
const ___ = "fill this with correct answer";
const ____ = 0;

const list: Array<string> = new Array();
let total = 0;

export default async function () {
    asyncScheduler.schedule(() => {
        list.push('item1');
    });

    asapScheduler.schedule(() => {
        list.push('item2');
    });

    asyncScheduler.schedule(() => {
        list.push('item3');
    });

    await sleep(1000);
    expect(list).to.deep.equal([___, ___, ___]);
}
