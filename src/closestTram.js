const moment = require('moment');

const yarra = require('./yarraTramsAPI');

const ARRIVAL_CUTOFF = 4.5;

function arrivalCalculator(items) {
    return new Promise((resolve) => {
        let closestArrival = null;
        for (let item of items) {
            let arrivalTime = moment(item.PredictedArrivalDateTime, moment.ISO_8601);
            let requestDateTime = moment(item.RequestDateTime, moment.ISO_8601);

            //Ensure that the arrival time is not less than 4.5 minutes
            let duration = moment.duration(arrivalTime.diff(requestDateTime));
            let minutes = duration.asMinutes();

            console.log(`Arrival time: ${arrivalTime}`);
            if ((closestArrival === null || closestArrival.isAfter(arrivalTime)) && minutes >= ARRIVAL_CUTOFF) {
                closestArrival = arrivalTime;
            }
        }

        resolve(closestArrival);
    });
}

function performAction(closestArrival, action) {
    let now = moment(new Date());

    let duration = moment.duration(closestArrival.diff(now));
    let minutes = duration.asMinutes();
    console.log(`Closest Arrival in minutes: ${minutes} \t`);

    switch (true) {
    case (minutes >= ARRIVAL_CUTOFF && minutes < 5.5):
        action.high();
        break;
    case (minutes >= 5.5 && minutes < 6.5):
        action.medium();
        break;
    case (minutes >= 6.5 && minutes < 7.5):
        action.low();
        break;
    default:
        action.differed();
        break;
    }

}


function start(action) {
    return yarra
        .getNextPredictedRoute()
        .then((items) => arrivalCalculator(items))
        .then(closestArrival => performAction(closestArrival, action));
}

module.exports = {
    start
};