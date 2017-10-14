const config = require('config');
const _ = require('lodash');
const soap = require('soap');

const url = './yarra.wsdl';

const GUID = config.get('yarra-trams.apiGUID');
const STOP_NUMBER = config.get('yarra-trams.stopNo');
const ROUTE_NUMBER = config.get('yarra-trams.routeNo');
const LOW_FLOOR = config.get('yarra-trams.lowFloor');

function getNextPredictedRoute() {
    return new Promise((resolve, reject) => {
        soap.createClient(url, function(err, client) {
            client.addSoapHeader(`<PidsClientHeader xmlns="http://www.yarratrams.com.au/pidsservice/"><ClientGuid>${GUID}</ClientGuid><ClientType>WEBPID</ClientType><ClientVersion>1.1.0</ClientVersion><ClientWebServiceVersion>6.4.0.0</ClientWebServiceVersion></PidsClientHeader>`);
            client.GetNextPredictedRoutesCollection ({
                stopNo: STOP_NUMBER,
                routeNo: ROUTE_NUMBER,
                lowFloor: LOW_FLOOR
            },function (err,result) {
                if(err) {
                    console.log('Issuing accessing API', err);
                    reject(err);
                }
                resolve(_.get(result,'GetNextPredictedRoutesCollectionResult.diffgram.DocumentElement.ToReturn',null));
            });

        });
    });
}

module.exports = {
    getNextPredictedRoute
};