'use strict';

/**
 * Set exponent of number
 * @param {number} number
 * @param {number} exponent
 * @returns {number}
 */
function power(number, exponent) {
    var parts = number.toString().split('E');
    parts[1] = parts.length > 1 ? parseInt(parts[1], 10) : 0;
    parts[1] += exponent;
    return parseFloat(parts.join('E'));
}

/**
 * Extracting fraction and exponent
 * @param {number} number
 * @returns {number}
 */
function exponent(number) {
    var parts = number.toString().split('E'),
        exp = parts.length > 1 ? parseInt(parts[1], 10) : 0;
    parts = parts[0].split('.');
    exp += parts.length > 1 ? parts[1].length : 0;
    return exp;
}

/**
 * Create step test
 * @param {number} step
 * @param {number} base
 * @returns {Function}
 */
module.exports = function (step, base) {
    var exp = exponent(step);
    step = power(step, exp);

    /**
     * Matches value the given step?
     * @param {number} value
     * @returns {boolean}
     */
    return function (value) {
        value -= base;
        value = power(value, exp);
        return exponent(value) >= 0 && value % step === 0;
    };
};