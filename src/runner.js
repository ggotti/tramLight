const config = require('config');
const moment = require('moment');

const closest = require('./closestTram');
const lifxAction = require('./lifxAction');

const RUN_DURATION = config.get('runner.runDurationInMinutes');
const RUN_FREQUENCY = config.get('runner.frequencyInSeconds');

function start() {
    return new Promise((resolve) => {
        let startTime = Date.now();
        let finishTime = moment(startTime).add(RUN_DURATION, 'minutes');
        lifxAction.start().then(() => {
            console.log('Starting at: ' + (moment(startTime).format('hh:mm') + ', Stop Time: ' + finishTime.format('hh:mm')));
            let interval = setInterval(() => {
                let currentTime = moment(Date.now());
                //Stops the loop
                if (currentTime > finishTime) {
                    console.log('Stopping Runner');
                    lifxAction.stop();
                    clearInterval(interval);
                    resolve();
                } else {
                    closest.start(lifxAction);
                }
            }, RUN_FREQUENCY * 1000);
        });
    });
}


module.exports = {
    start
};