import Mocha, { AsyncFunc, Test } from 'mocha';
import { headerCase } from 'change-case';

const Paths = {
    Test01: '01_simple_observables',
    Test02: '02_periodic_events',
    Test03: '03_cancelling_subscription',
    Test04: '04_creation_operators_of',
    Test05: '05_subjects',
    Test06: '06_scheduler',
    Test07_AutoComplete: '07_project_autocomplete',
    Test08_TestAutoCompleteDup: '08_project_autocomplete_dup',
    Test09_TestCleanArchitecture: './projects/09_test_clean_architecture',
    Test10_TestFunctionalInterface: './projects/10_test_functional_interface',
    // Test10_TestCleanRxJs: './projects/10_test_clean_rxjs_redis/index',
}

export async function load_tests() {
    const tests: Mocha.Test[] = [];

    for (let [_key, value] of Object.entries(Paths)) {
        console.log('loading test', `./${value}`);
        tests.push(
            new Test(
                headerCase(value),
                (await import(`./${value}`)).default as AsyncFunc
            )
        );
    }

    return tests;
}

export async function load_current_level_test(current_level: number) {
    const current_level_test = Object.entries(Paths).filter(([key, value]) => {
        return key.substring(4, 6) === `${current_level + 1}`.padStart(2, '0');
    })[0];

    console.log('loading test', `./${current_level_test[1]}`);

    return new Test(
        headerCase(current_level_test[1]),
        (await import(`./${current_level_test[1]}`)).default as AsyncFunc
    ) as Mocha.Test;
}