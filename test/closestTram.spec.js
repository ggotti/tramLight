let assert = require('chai').assert;
let sinon = require('sinon');
let ct = require('../src/closestTram');
let yarra = require('../src/yarraTramsAPI');
let fs = require('fs');
let path = require('path');
let _ = require('lodash');

describe('Tram Tracker', function () {
    //Mon May 08 2017 21:15:24 GMT+1000
    // Approx 8 minutes before
    const DEFAULT_TIME = 1494242124000;
    const ONE_MINUTE = 60 * 1000;

    let action;
    let clock;
    let predictedRoute;

    before(function () {
        // Stubs out return behaviour
        predictedRoute = sinon.stub(yarra, 'getNextPredictedRoute').callsFake(() => {
            return new Promise((resolve, reject) => {
                fs.readFile(path.resolve(__dirname, 'sample.json'), function (err, data) {
                    if (err) reject(err);
                    resolve(JSON.parse(data));
                });
            });
        });
    });

    beforeEach(function () {
        action = {
            high: sinon.stub(),
            medium: sinon.stub(),
            low: sinon.stub(),
            differed: sinon.stub()
        };
        clock = sinon.useFakeTimers(DEFAULT_TIME);
    });

    afterEach(function () {
        clock.restore();
    });

    after(function(){
        predictedRoute.restore();
    });

    function checkActions(action, urgentExpected, mediumExpected, lowPriortyExpected, differedExpected) {
        assert.equal(action.high.called, urgentExpected, 'Urgent value not as expected');
        assert.equal(action.medium.called, mediumExpected, 'High Priorty value not as expected');
        assert.equal(action.low.called, lowPriortyExpected, 'Low Priority value not as expected');
        assert.equal(action.differed.called, differedExpected, 'Differed value not as expected');
    }

    describe('Closest Tram', function () {
        let tramTypes = [{title: 'no tram', clockDifference: 0, checkActions: [false, false, false, true]},
            {title: 'tram low priority', clockDifference: ONE_MINUTE, checkActions: [false, false, true, false]},
            {title: 'tram medium priority', clockDifference: 2 * ONE_MINUTE, checkActions: [false, true, false, false]},
            {title: 'tram high priority', clockDifference: 3 * ONE_MINUTE, checkActions: [true, false, false, false]}];

        for (let test of tramTypes) {
            it(test.title, function () {
                clock.tick(test.clockDifference);
                return ct.start(action)
                    .then((ok) => {
                        checkActions.apply(this, _.concat([action], test.checkActions));
                    });
            });
        }
    });
});
