'use strict';

var _ = require('lodash');

/**
 * Pass a test
 * @returns {boolean}
 */
function pass() {
    return true;
}

/**
 * Fail a test
 * @returns {boolean}
 */
function fail() {
    return false;
}

module.exports.pass = pass;
module.exports.fail = fail;

/**
 * Create combined tests
 * @param {Function[]} tests
 * @param {boolean} [every=false]
 * @returns {Function}
 */
module.exports.collection = function (tests, every) {

    /**
     * Pass value any of the given tests
     * @param {*}
     * @returns {boolean}
     */
    return function (value) {
        return tests[every ? 'every' : 'some'](function (test) {
            return test(value);
        });
    };
};

/**
 * Create contain test
 * @param {Array} options
 * @returns {Function}
 */
module.exports.contains = function (options) {

    /**
     * Is value member of options?
     * @param {*} value
     * @returns {boolean}
     */
    return function (value) {
        return _.includes(options, value);
    };
};

/**
 * Create pattern test
 * @param {RegExp|RegExp[]} pattern
 * @returns {Function}
 */
module.exports.pattern = function (pattern) {
    var patterns = _.isArray(pattern) ? pattern : pattern ? [pattern] : [];

    /**
     * Does value match any pattern?
     * @param {string} value
     * @returns {boolean}
     */
    return function (value) {
        return _.some(patterns, function (pattern) {
            return pattern.test(value);
        });
    };
};

/**
 * Create instance test
 * @param {Function} Class
 * @returns {Function}
 */
module.exports.instance = function (Class) {

    /**
     * Is value an instance of class?
     * @param {*} value
     * @returns {boolean}
     */
    return function (value) {
        return value instanceof Class;
    };
};

/**
 * Create lower then test
 * @param {number} limit
 * @param {boolean} [equal=false]
 * @returns {Function}
 */
module.exports.lt = function (limit, equal) {

    /**
     * Is value lower then the limit
     * @param {number} value
     * @returns {boolean}
     */
    return function (value) {
        return value < limit || equal && value === limit;
    };
};

/**
 * Create greater then test
 * @param {number} limit
 * @param {boolean} [equal=false]
 * @returns {Function}
 */
module.exports.gt = function (limit, equal) {

    /**
     * Is value greater then the limit
     * @param {number} value
     * @returns {boolean}
     */
    return function (value) {
        return value > limit || equal && value === limit;
    };
};

/**
 * Create truth test
 * @param {number} truth
 * @returns {Function}
 */
module.exports.truth = function (truth) {

    /**
     * Does truth not exceed the given threshold?
     * @param {number} value
     * @returns {boolean}
     */
    return function (value) {
        var parts = value.toString().split('E'),
            exponent = parseFloat(parts[1]) || 0,
            decimal = parts[0].split('.')[1] || '';
        return decimal.length - exponent <= truth;
    };
};

/**
 * Create step test
 * @type {Function}
 */
module.exports.step = require('./test/step');