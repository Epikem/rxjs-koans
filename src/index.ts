import { expect } from 'chai';
import Rx from 'rxjs';
import { fromEvent } from 'rxjs';
import { scan } from 'rxjs/operators';
import { Observable } from 'rxjs';
import fs from 'fs';

import Mocha from 'mocha';
import Test01 from './tests/01_simple_observables';
import Test02 from './tests/02_periodic_events';
import Test03 from './tests/03_cancelling_subscription';
import Test04 from './tests/04_creation_operators';
const ___ = "fill this with correct answer";
const CheckpointPath = './checkpoint';

var Test = Mocha.Test;
var Suite = Mocha.Suite;

var mocha = new Mocha();
mocha.timeout('10s');
var suite: Mocha.Suite;
var currentLevel = 0;

const Tests = [
    new Test('Test 01 - simple observables', Test01),
    new Test('Test 02 - periodic events', Test02),
    new Test('Test 03 - cancelling subscription', Test03),
    new Test('Test 04 - creation operators', Test04),
]

function init() {
    var isCheckpointExists = fs.existsSync(CheckpointPath);

    if (!isCheckpointExists) {
        fs.writeFileSync(CheckpointPath, '0');
        console.log('checkpoint file created');
    }
    
    currentLevel = +fs.readFileSync(CheckpointPath, { encoding: 'utf8' });
    suite = Suite.create(mocha.suite, `Question. `);
    
    suite.addTest(Tests[currentLevel])

    suite.timeout('10s');
}

init();

var runner = mocha.run();

runner.on('fail', () => {
    setTimeout(() => {
        console.error('test FAILED!');
    }, 1000);
})

runner.on('pass', () => {
    setTimeout(() => {
        console.info('congratulations. test PASSED!');
        console.info('proceeding to next level...');
    }, 1000);
    setTimeout(() => {
        currentLevel = +currentLevel + 1;

        if (currentLevel === Tests.length) {
            console.info('congratulations. you have passed all levels!');
            return;
        }

        console.log('current level: ', currentLevel);

        suite.tests = [];

        suite.addTest(Tests[currentLevel]);

        fs.writeFileSync(CheckpointPath, ''+currentLevel, { encoding: 'utf-8' });
    }, 5000);
})



// describe('index.ts 테스트', () => {
//     it('should pass', () => {
//         expect('asd', 'what').to.be.equal('asd')
//     })
// });

// describe('purity', () => {
//     it('is pure', () => {

//         const observable = new Observable(subscriber => {
//             subscriber.next(1);
//             subscriber.next(2);
//             subscriber.next(3);
//             setTimeout(() => {
//                 subscriber.next(4);
//                 subscriber.complete();
//             }, 1000);
//         });

//         console.log('just before subscribe');
//         observable.subscribe({
//             next(x) { console.log('got value ' + x); },
//             error(err) { console.error('something wrong occurred: ' + err); },
//             complete() { console.log('done'); }
//         });
//         console.log('just after subscribe');
//     })
// })