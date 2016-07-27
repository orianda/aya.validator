'use strict';

var _ = require('lodash'),
    momento = require('./util/momento');

/**
 * Convert value to date
 * @param {*} value
 * @returns {Date}
 */
module.exports.date = function (value) {
    return momento.parse(value).date;
};

/**
 * Convert date to timestamp
 * @param {number|string|Date} value
 * @returns {number}
 */
module.exports.timestamp = function (value) {
    return momento.parse(value).timestamp();
};

/**
 * Convert date to week
 * @param {number|string|Date} value
 * @returns {string}
 */
module.exports.week = function (value) {
    return momento.parse(value).week();
};

/**
 * Create date formatter
 * @param {string} format
 * @returns {Function}
 */
module.exports.format = function (format) {

    /**
     * Format given date
     * @param {Date} value
     * @returns {string}
     */
    return function (value) {
        return momento.parse(value).format(format);
    };
};

/**
 * Converts value to array
 * @param {*} value
 * @returns {Array}
 */
module.exports.array = function (value) {
    if (_.isUndefined(value)) {
        return [];
    }
    if (_.isArray(value)) {
        return value;
    }
    return [value];
};

/**
 * Converts value to boolean
 * @param {number|string} value
 * @returns {boolean}
 */
module.exports.boolean = function (value) {
    var string = _.trim(value),
        parsed = string && !(_.isNumber(value) && isNaN(value)) && !(/false|off|no|0+/i).test(string);
    return !!parsed;
};