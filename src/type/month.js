'use strict';

var date = require('../fsm/date'),
    momento = require('../util/momento');

/**
 * Get last day of month
 * @param {Date} date
 * @returns {number}
 */
function lastDayOfMonth(date) {
    date = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);
    return date.getUTCDate();
}

/**
 * Convert value into months
 * @param {number|string|Date} value
 * @returns {number}
 */
function decode(value) {
    var parsed = momento.parse(value),
        year, month, fraction;
    if (!parsed.isValid()) {
        return NaN;
    }
    year = parsed.date.getUTCFullYear();
    month = parsed.date.getUTCMonth();
    fraction = parsed.date.getUTCMilliseconds();
    fraction = fraction / 1000 + parsed.date.getUTCSeconds();
    fraction = fraction / 60 + parsed.date.getUTCMinutes();
    fraction = fraction / 60 + parsed.date.getUTCHours();
    fraction = fraction / 24 + parsed.date.getUTCDate() - 1;
    fraction = fraction / (lastDayOfMonth(parsed.date) - 1);
    return year * 12 + month + fraction;
}

/**
 * Converts months into string
 * @param {number} months
 * @returns {string}
 */
function encode(months) {
    var years = Math.floor(months / 12);
    months = months % 12 + 1;
    return years + '-' + String(months + 100).substring(1);
}

/**
 * Create fsm for date type
 * @param {Object} props
 * @returns {FSM}
 */
module.exports = function (props) {
    return date(props, decode, encode, 1, 1, 0);
};