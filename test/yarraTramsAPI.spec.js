let assert = require('chai').assert;
let sinon = require('sinon');
let soap = require('soap');
let yarra = require('../src/yarraTramsAPI');

describe('Yarra Trams API', function () {
    let createClientStub;
    let sampleReturnObj = sinon.stub();
    let sampleResponse = {
        'GetNextPredictedRoutesCollectionResult': {
            'diffgram': {
                'DocumentElement': {
                    'ToReturn': sampleReturnObj
                }
            }
        }
    };

    function stubSOAPClient(response = sampleResponse) {
        return sinon.stub(soap, 'createClient').callsFake(function (args, cb) {
            let client = {
                addSoapHeader: sinon.stub(),
                GetNextPredictedRoutesCollection: sinon.stub().callsFake(function (args, cb) {
                    cb(null, response);
                })
            };

            // client.GetNextPredictedRoutesCollection
            cb(null, client);
        });
    }

    beforeEach(function () {
        // //Stub soap
    });

    afterEach(function () {
        if (createClientStub != null) {
            createClientStub.restore();
        }
    });

    describe('getNextPredictedRoute', function () {

        it('online', function () {
            return yarra.getNextPredictedRoute().then((ok) => {
                console.log(ok);
            });
        });
        it('sunny day', function () {
            createClientStub = stubSOAPClient();
            return yarra.getNextPredictedRoute().then((ok) => {
                assert.equal(sampleReturnObj, ok);
            });
        });

        it('blank day', function () {
            createClientStub = stubSOAPClient({
                notValidPath: 'in object'
            });
            return yarra.getNextPredictedRoute().then((ok) => {
                assert.isNull(ok);
            });
        });
    });
});
