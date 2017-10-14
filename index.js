'use strict';
const CronJob = require('cron').CronJob;
const runner = require('./src/runner');
const lifxAPI = require('./src/lifxAPI');
const config = require('config');


// FROM: http://tram.ascii.uk/
console.log("      ,',                               ");
console.log("      ', ,'                             ");
console.log("   ,----'--------------------------.    ");
console.log("  ('''|```|```|```|```|```|```|``|` |   ");
console.log("  |---'---'---'---'---'---'---'--'--|   ");
console.log(" __,_    ______           ______     |_ ");
console.log("   '---'(O)(O)'---------'(O)(O)'---'    ");
console.log("   * * * *  Tram Lights * * * *         ");
console.log("   * * * * * * * * * *  * * * *         ");

const TIME_ZONE='Australia/Melbourne';
const CRON_FORMAT = config.get('runner.startTimer');
new CronJob(CRON_FORMAT, runner.start, null, true, TIME_ZONE);

// runner.start();