'use strict';

var turn = require('../turn'),
    date = require('../fsm/date');

/**
 * Converts months into string
 * @param {number} seconds
 * @returns {string}
 */
function encode(seconds) {
    var hours, minutes;
    hours = Math.floor(seconds / 60 / 60);
    seconds -= hours * 60 * 60;
    minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return (hours < 10 ? '0' : '') + hours + ':' +
        String(minutes + 100).substring(1) + ':' +
        String(seconds + 100).substring(1);
}

/**
 * Create fsm for date type
 * @param {Object} props
 * @returns {FSM}
 */
module.exports = function (props) {
    return date(props, turn.timestamp, encode, 1, 0.001, 0);
};