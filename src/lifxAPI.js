const constants = require('node-lifx').constants;
const packet = require('node-lifx').packet;
const LifxClient = require('node-lifx').Client;
const config = require('config');
const timer = require('timers');

const KELVIN = 3500;
const GLOBE_LABEL = config.get('lifx.label');

let client = new LifxClient();
let globe;

function start() {
    return globeIsAvailable().then(() => {
        return new Promise((resolve, reject) => {
            globe.on(0, (err) => {
                if (err) {
                    reject(err);
                }
                globe.color(0, 0, 0, 3500, 1000);
                resolve();
            });
        });
    });
}

function stop() {
    return globeIsAvailable().then(() => {
        globe.off();
    });
}

function globeIsAvailable() {
    return new Promise((resolve,reject) => {
        let retryCount = 0;
        const retryMax = 5;

        function checkGlobe() {
            if (globe != null) {
                resolve(true);
            }
            else {
                retryCount++;
                if(retryCount < retryMax) {
                    timer.setTimeout(checkGlobe, 500);
                } else {
                    reject('Cannot find globe');
                }
            }
        }

        checkGlobe();
    });
}

/**
 * Sets globe to the supplied colours. See https://www.npmjs.com/package/node-lifx#lightcolorhue-saturation-brightness-kelvin-duration-callback
 * for details.
 * @param hueColour: Colour hue between 0 and 360
 * @param saturation: Colour intensity beteen 0 and 100
 * @param brightness: Colour brightness beteen 0 and 100.
 * @param duration Duration in milliseconds.
 * @returns {Promise.<TResult>}
 */
function colour(hueColour, saturation, brightness, duration = 1000) {
    return globeIsAvailable().then(() => new Promise((resolve, reject) => {
        globe.color(hueColour, saturation, brightness, KELVIN, duration, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    }));
}

/**
 *  Based on this: https://github.com/MariusRumpf/node-lifx/commit/45c7ab8f88799486d921e6b69e618fb479bc7f0a
 *
 * @returns {Promise}
 * @param hueColour: Colour hue between 0 and 360
 * @param saturation: Colour intensity beteen 0 and 100
 * @param brightness: Colour brightness beteen 0 and 100.
 * @param period: Period time, in milliseconds.
 * @param cycles: Number of periods to complete.
 * @param skewRatio: Range of the wave.
 * @param waveForm. Value of either: SAW, SINE, HALF_SINE, TRIANGLE, PULSE
 * @returns {Promise.<TResult>}
 */
function pulse(hueColour,
    saturation,
    brightness,
    period = 5000,
    cycles = 5,
    skewRatio = 0.5,
    waveForm = 'SINE') {
    let hueColourCalc = Math.round(hueColour / constants.HSBK_MAXIMUM_HUE * 65535);
    let saturationCalc = Math.round(saturation / constants.HSBK_MAXIMUM_SATURATION * 65535);
    let brightnessCalc = Math.round(brightness / constants.HSBK_MAXIMUM_BRIGHTNESS * 65535);
    let waveFormInt = constants.LIGHT_WAVEFORMS.indexOf(waveForm);

    return globeIsAvailable().then(() => new Promise((resolve) => {
        let packetObj = packet.create('setWaveform', {
            isTransient: true,
            color: {hue: hueColourCalc, saturation: saturationCalc, brightness: brightnessCalc, kelvin: KELVIN},
            period: period,
            cycles: cycles,
            skewRatio: skewRatio,
            waveform: waveFormInt
        }, client.source);

        packetObj.target = globe.id;
        client.send(packetObj, (err, ok) => {
            resolve(ok);
        });
    }));
}

function setGlobe(light) {
    globe = light;
}


function init() {
    client.on('light-new', function (light) {
        console.log('Globe Found');
        light.getLabel((error, label) => {
            if (label === GLOBE_LABEL) {
                console.log(`Globe with label: '${label}' found`);
                setGlobe(light);
            }
        });
    });

    client.init({
        lightOfflineTolerance: 3,
        messageHandlerTimeout: 45000, // in ms, if not answer in time an error is provided to get methods
        startDiscovery: true, // start discovery after initialization
        resendPacketDelay: 150, // delay between packages if light did not receive a packet (for setting methods with callback)
        resendMaxTimes: 3, // resend packages x times if light did not receive a packet (for setting methods with callback)
        debug: false, // logs all messages in console if turned on
        address: '0.0.0.0', // the IPv4 address to bind the udp connection to
        broadcast: '255.255.255.255', // set's the IPv4 broadcast address which is addressed to discover bulbs
        lights: []
    });
}


init();

module.exports = {
    setGlobe,
    pulse,
    colour,
    start,
    stop
};

