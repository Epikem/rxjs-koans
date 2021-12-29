import Mocha, { Test } from 'mocha';
import { headerCase } from 'change-case';

const Paths = {
    Test01: '01_simple_observables',
    Test02: '02_periodic_events',
    Test03: '03_cancelling_subscription',
    Test04: '04_creation_operators_of',
}

export async function load_tests () {
    const Tests: Mocha.Test[] = [];

    for (let [key, value] of Object.entries(Paths)) {
        console.log('loading test', value);
        const test = new Test(headerCase(value), await import(`./${value}`));
        Tests.push(test);
    }

    return Tests;
}
