import { expect } from 'chai';
import Rx from 'rxjs';
import { fromEvent } from 'rxjs';
import { scan } from 'rxjs/operators';
import { Observable } from 'rxjs';
import fs from 'fs';

import Mocha from 'mocha';
const ___ = "fill this with correct answer";
const CheckpointPath = './checkpoint';

var Test = Mocha.Test;
var Suite = Mocha.Suite;

var mocha = new Mocha();
var suite = Suite.create(mocha.suite, 'My test suite with dynamic test cases');
var currentLevel = 0;

const Tests = [
    new Test('val', function () {
        expect('val').to.equal('val');
    }),
    new Test('val', function () {
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

    if (currentLevel === 0) {
        suite.addTest(Tests[0]);
    }
    
    if (currentLevel === 1) {
        suite.addTest(Tests[1]);
    }
}

var runner = mocha.run();

runner.on('fail', () => {
    setTimeout(() => {
        console.error('test FAILED!');
    }, 1000);
})

runner.on('pass', () => {
    setTimeout(() => {
        console.error('test SUCCESS!');
        
        currentLevel = +currentLevel + 1;

        console.log('current level: ', currentLevel);

        suite.tests = [];

        suite.addTest(Tests[currentLevel]);

        fs.writeFileSync(CheckpointPath, ''+currentLevel, { encoding: 'utf-8' });
    }, 1000);
})

init();


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