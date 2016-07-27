'use strict';

const MAP = {
    'DD': Date.prototype.getUTCDate,
    'D': Date.prototype.getUTCDate,
    'dd': Date.prototype.getUTCDay,
    'd': Date.prototype.getUTCDay,
    'MM': function () {
        return this.getUTCMonth() + 1;
    },
    'M': Date.prototype.getUTCMonth,
    'YYYY': Date.prototype.getUTCFullYear,
    'YY': function () {
        return this.getUTCFullYear().toString().substring(2);
    },
    'HH': Date.prototype.getUTCHours,
    'H': Date.prototype.getUTCHours,
    'mm': Date.prototype.getUTCMinutes,
    'm': Date.prototype.getUTCMinutes,
    'ss': Date.prototype.getUTCSeconds,
    's': Date.prototype.getUTCSeconds,
    'n': Date.prototype.getUTCMilliseconds,
    'Z': function () {
        var offset, sign, hours, minutes;
        offset = this.getTimezoneOffset();
        sign = offset < 0 ? '+' : '-';
        offset *= offset < 0 ? -1 : +1;
        hours = Math.floor(offset / 60);
        minutes = offset - hours * 60;
        return sign + pad(hours, 2) + ':' + pad(minutes, 2);
    },
    'u': Date.prototype.getTime,
    'U': function () {
        return this.getTime() / 1000;
    }
};

var _ = require('lodash');

/**
 * Prefix value by zeros until the given length
 * @param {number} value
 * @param {number} length
 * @returns {string}
 */
function pad(value, length) {
    var string = value.toString();
    length = length - string.length;
    length = Math.max(0, length);
    return '0'.repeat(length) + string;
}

/**
 * Returns first day of first week of the given year
 * @param {number|string} year
 * @param {number|string} [shift] Represents what day of week should be returned.
 * @returns {number}
 */
function firstWeek(year, shift) {
    var date = Date.parse(year + '-01-01T00:00:00Z'),
        day = new Date(date).getUTCDay();
    day = day > 4 ? 7 - day : -day;
    shift = Math.max(0, parseInt(shift, 10)) || 0;
    shift %= 7;
    return date / 1000 + 86400 * (day + shift);
}

/**
 * Create instance
 * @param date
 * @returns {Momento}
 * @constructor
 */
function Momento(date) {
    if (!(this instanceof Momento)) {
        return new Momento(date);
    } else if (date instanceof Momento) {
        this.date = new Date(date.date);
    } else if (date instanceof Date) {
        this.date = date;
    } else {
        this.date = Momento.parse(date).date;
    }
}

/**
 * Is the given date valid?
 * @returns {boolean}
 */
Momento.prototype.isValid = function () {
    var ts = this.date.getTime();
    return !isNaN(ts);
};

/**
 * Format date
 * @param {string} [format]
 * @returns {string}
 */
Momento.prototype.format = function (format) {
    var date = this.date;
    if (!this.isValid()) {
        return '';
    }
    format = _.trim(format);
    if (!format) {
        return this.date.toString();
    }
    var regex = new RegExp(Object.keys(MAP).join('|'), 'g');
    return format.replace(regex, function (match) {
        var value = MAP[match].call(date);
        return pad(value, match.length);
    });
};

/**
 * Parse string to date Object
 * @param {*} date
 * @returns {Momento}
 */
Momento.parse = function (date) {
    if (date instanceof Momento) {
        return date;
    }
    if (date instanceof Date) {
        return new Momento(date);
    }
    if (_.isNumber(date)) {
        return new Momento(new Date(date * 1000));
    }
    if (_.isString(date)) {
        let issue;
        date = _.trim(date);
        if ((/^[+-]?\d+(\.\d+)?(E[+-?]\d+)?$/i).test(date)) {
            return Momento.parse(parseFloat(date));
        }
        if ((/^\d+:\d+(:\d+(\.\d+)?)?([+-]\d{2}:?\d{2})?$/).test(date)) {
            return new Momento(new Date('1970-01-01T' + date));
        }
        if ((/^\d+-W\d+$/i).test(date)) {
            var parts = date.toUpperCase().split('-W'),
                timestamp = firstWeek(parts[0], 1) + (parseInt(parts[1], 10) - 1) * 604800;
            return Momento.parse(timestamp);
        }
        issue = new Momento(new Date(date));
        if (issue.isValid()) {
            return issue;
        }
        issue = new Momento(new Date(date.replace(' ', 'T')));
        if (issue.isValid()) {
            return issue;
        }
    }
    return new Momento(new Date(date));
};

/**
 * Get timestamp
 * @returns {number}
 */
Momento.prototype.timestamp = function () {
    return this.date.getTime() / 1000;
};

/**
 * Get week
 * @returns {string}
 */
Momento.prototype.week = function () {
    var date = this.date,
        first, week;
    // Copy date so don't modify original
    date = new Date(+date);
    date.setUTCHours(0, 0, 0);
    date.setUTCMilliseconds(0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    // Get first day of year
    first = new Date(date.getUTCFullYear(), 0, 1);
    // Calculate full weeks to nearest Thursday
    week = Math.ceil(( ( (date - first) / 86400000) + 1) / 7);
    // Return array of year and week number
    return date.getUTCFullYear() + '-W' + String(week + 100).substring(1);
};

module.exports = Momento;