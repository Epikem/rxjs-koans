import fs from 'fs';

import Mocha from 'mocha';
import { load_tests } from './tests';

const CheckpointPath = './checkpoint';

var Suite = Mocha.Suite;

var mocha = new Mocha();
var suite: Mocha.Suite;
var currentLevel = 0;
var tests: Mocha.Test[] = [];

async function init() {
    var isCheckpointExists = fs.existsSync(CheckpointPath);
    tests = await load_tests();

    if (!isCheckpointExists) {
        fs.writeFileSync(CheckpointPath, '0');
        console.log('checkpoint file created');
    }
    
    currentLevel = +fs.readFileSync(CheckpointPath, { encoding: 'utf8' });
    suite = Suite.create(mocha.suite, `Question. `);
    
    mocha.timeout('10s');
    suite.timeout('10s');

    suite.addTest(tests[currentLevel]);

    mocha.run()
        .on('fail', () => {
            setTimeout(() => {
                console.error('test FAILED!');
            }, 1000);
        })
        .on('pass', () => {
            setTimeout(() => {
                console.info('congratulations. test PASSED!');
                console.info('proceeding to next level...');
            }, 1000);
            setTimeout(() => {
                currentLevel = +currentLevel + 1;
        
                if (currentLevel === tests.length) {
                    console.info('congratulations. you have passed all levels!');
                    return;
                }
        
                console.log('current level: ', currentLevel);
        
                suite.tests = [];
        
                suite.addTest(tests[currentLevel]);
        
                fs.writeFileSync(CheckpointPath, ''+currentLevel, { encoding: 'utf-8' });
            }, 5000);
        })
        
}

init();
