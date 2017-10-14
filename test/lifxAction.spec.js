let assert = require('chai').assert;
let sinon = require('sinon');
let lifxAction = require('../src/lifxAction');
let lifxAPI = require('../src/lifxAPI');

describe('LIFX Actions', function () {
    let stubbedColour;
    let stubbedPulse;

    before(function () {
        stubbedColour = sinon.stub(lifxAPI, 'colour').resolves('ok');
        stubbedPulse = sinon.stub(lifxAPI, 'pulse').resolves('ok');
    });

    after(function () {
        stubbedColour.restore();
        stubbedPulse.restore();
    });

    it('differed', function () {
        return lifxAction.differed().then(() => {
            assert(stubbedColour.called);
            assert.isNotOk(stubbedPulse.called);
        });
    });

    it('low', function () {
        return lifxAction.low().then(() => {
            assert(stubbedColour.called);
            assert.isNotOk(stubbedPulse.called);
        });
    });

    it('medium', function () {
        return lifxAction.medium().then(() => {
            assert.isOk(stubbedColour.called);
            assert.isNotOk(stubbedPulse.called);

        });
    });

    it('high', function () {
        return lifxAction.high().then(() => {
            assert(stubbedColour.called);
            assert(stubbedPulse.called);
        });
    });
});