import Mocha, { AsyncFunc, Test } from 'mocha';
import { headerCase } from 'change-case';

const Paths = {
    Test01: '01_simple_observables',
    Test02: '02_periodic_events',
    Test03: '03_cancelling_subscription',
    Test04: '04_creation_operators_of',
    Test05: '05_subjects',
    Test06: '06_scheduler',
    Test07_AutoComplete: 'project_autocomplete',
    Test08_TestAutoCompleteDup: 'project_autocomplete_dup',
    Test09_ProjectAPILimit: 'project_api_limit',
}

export async function load_tests() {
    const Tests: Mocha.Test[] = [];

    for (let [key, value] of Object.entries(Paths)) {
        console.log('loading test', `./${value}`);
        Tests.push(
            new Test(
                headerCase(value),
                (await import(`./${value}`)).default as AsyncFunc
            )
        );
    }

    return Tests;
}
