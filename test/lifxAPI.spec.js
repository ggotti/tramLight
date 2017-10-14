let assert = require('chai').assert;
let sinon = require('sinon');
let NodeLifx = require('node-lifx');
let fs = require('fs');
let path = require('path');
let config = require('config');

const GLOBE_LABEL = config.get('lifx.label');
const KELVIN = 3500;

describe('LIFX API', function () {
    let globe;
    let lifx;
    let mockClient;
    let sendStub;

    before(function () {

        sendStub = sinon.stub();
        sendStub.yields();

        mockClient = function () {
            this.on = (event, cb) => {
            };
            this.init = () => {
            };

            this.constructor = () => {
            };

            this.send = sendStub;
        };

        NodeLifx.Client = mockClient;
        lifx = require('../src/lifxAPI');
    });

    beforeEach(function () {
        globe = {
            getLabel: (cb) => {
                cb(null, GLOBE_LABEL);
            },
            on: sinon.spy((timeout, cb) => {
                cb(null);
            }),
            color: sinon.stub(),
            off: sinon.stub()
        };
    });

    afterEach(function () {

    });

    it('start', function () {
        lifx.setGlobe(globe);

        return lifx.start().then((ok) => {
            assert(globe.on.called);
            assert(globe.color.called);
        });
    });

    it('globe not found before call', function () {
        lifx.setGlobe(null);

        return lifx.start().then((ok) => {
            assert(!globe.on.called);
            assert(!globe.off.called);
        }, (err) => {
            console.log('Err: ' + err);
        });
    }).timeout(5000);

    it('stop', function () {
        lifx.setGlobe(globe);

        return lifx.stop().then((ok) => {
            assert(globe.off);
            // assert(globe.color);
        });
    });

    it('set globe colour', function () {
        let expectedHueColour = 234;
        let expectedSaturation = 94;
        let expectedBrightness = 31;
        let expectedDuration = 200;

        let globeStub = sinon.stub();
        globeStub.yields();

        globe.color = globeStub;
        lifx.setGlobe(globe);

        return lifx.colour(expectedHueColour,
            expectedSaturation,
            expectedBrightness,
            expectedDuration).then((ok) => {
            assert.equal(globe.color.callCount, 1);
            let callArgs = globe.color.getCalls()[0].args;
            assert.includeOrderedMembers(callArgs, [expectedHueColour,
                expectedSaturation, expectedBrightness, KELVIN, expectedDuration], 'Call args not equal');
        });
    });

    xit('sets pulse', function () {
        let expectedHueColour = 234;
        let expectedSaturation = 94;
        let expectedBrightness = 31;

        let globeStub = sinon.stub();
        globeStub.yields();

        globe.color = globeStub;
        lifx.setGlobe(globe);

        return lifx.pulse(expectedHueColour,
            expectedSaturation,
            expectedBrightness).then(() => {
            let lastSend = sendStub.lastCall;
            assert.isNotNull(lastSend);
            assert.isNotEmpty(lastSend.args);
            let callProps = lastSend.args[0];
            assert(callProps,'color.hue');
            assert(callProps,'color.saturation');
            assert(callProps,'color.brightness');
            assert(callProps,'color.kelvin');
        });
    });


});
