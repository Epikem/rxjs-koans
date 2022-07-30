import fs from 'fs';

import Mocha from 'mocha';
import { load_current_level_test, load_tests } from './tests';

const CheckpointPath = './checkpoint';

var Suite = Mocha.Suite;

var mocha = new Mocha();
var suite: Mocha.Suite;
var currentLevel = 0;
// var tests: Mocha.Test[] = [];
var testCnt = 10;

async function init() {
    var isCheckpointExists = fs.existsSync(CheckpointPath);

    if (!isCheckpointExists) {
        fs.writeFileSync(CheckpointPath, '0');
        console.log('checkpoint file created');
    }

    currentLevel = +fs.readFileSync(CheckpointPath, { encoding: 'utf8' });
    suite = Suite.create(mocha.suite, `Question. `);

    mocha.timeout('100s');
    suite.timeout('100s');

    // tests = await load_current_level_test(currentLevel);
    // suite.addTest(tests[currentLevel]);
    suite.addTest(await load_current_level_test(currentLevel));

    mocha.run()
        .on('fail', () => {
            setTimeout(() => {
                console.error('test FAILED!');
            }, 1000);
            // exit
            process.exit(1);
        })
        .on('pass', () => {
            setTimeout(() => {
                console.info('congratulations. test PASSED!');
                console.info('proceeding to next level...');
            }, 1000);
            setTimeout(async () => {
                currentLevel = +currentLevel + 1;

                if (currentLevel === testCnt) {
                    console.info('congratulations. you have passed all levels!');
                    return;
                }

                console.log('current level: ', currentLevel);

                suite.tests = [];

                suite.addTest(await load_current_level_test(currentLevel));

                fs.writeFileSync(CheckpointPath, ''+currentLevel, { encoding: 'utf-8' });
            }, 5000);
        })

}

init();
