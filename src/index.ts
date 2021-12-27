import { expect } from 'chai';
import Rx from 'rxjs';
import { fromEvent } from 'rxjs';
import { scan } from 'rxjs/operators';
import { Observable } from 'rxjs';
import fs from 'fs';

import Mocha from 'mocha';
import Test01 from './tests/01_simple_observables'
const ___ = "fill this with correct answer";
const CheckpointPath = './checkpoint';

var Test = Mocha.Test;
var Suite = Mocha.Suite;

var mocha = new Mocha();
var suite: Mocha.Suite;
var currentLevel = 0;

const Tests = [
    new Test('Test 01 - simple observables', Test01),
    new Test('Test 02', function () {
        expect('val').to.equal(___);
        return true;
    })
]

function init() {
    var isCheckpointExists = fs.existsSync(CheckpointPath);

    if (!isCheckpointExists) {
        fs.writeFileSync(CheckpointPath, '0');
        console.log('checkpoint file created');
    }
    
    currentLevel = +fs.readFileSync(CheckpointPath, { encoding: 'utf8' });
    suite = Suite.create(mocha.suite, `Question. `);
    
    if (currentLevel === 0) {
        suite.addTest(Tests[0])
    }
    
    if (currentLevel === 1) {
        suite.addTest(Tests[1]);
    }
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