const lifxAPI = require('./lifxAPI');

const YARRA_GREEN = 140;
const SATURATION = 50;

function high() {
    return lifxAPI.colour(YARRA_GREEN, SATURATION, 70, 0)
        .then(() => lifxAPI.pulse(0, 0, 0));
}

function medium() {
    return lifxAPI.colour(YARRA_GREEN, SATURATION, 70);
}

function low() {
    return lifxAPI.colour(YARRA_GREEN, SATURATION / 2, 50);
}

function differed() {
    return lifxAPI.colour(0, 0, 0);
}

function start() {
    return lifxAPI.start();
}

function stop() {
    return lifxAPI.stop();
}

module.exports = {
    high,
    medium,
    low,
    differed,
    start,
    stop
};

