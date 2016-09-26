'use strict';

var _ = require('lodash');

/**
 * Get combination factory
 * @param {number} slotAmount
 * @param {number} itemAmount
 * @returns {Function}
 */
module.exports = function (slotAmount, itemAmount) {
    var length = slotAmount * itemAmount,
        output = new Array(length),
        tick = -1;

    /**
     * Is current index already taken?
     * @param {number} index
     * @returns {boolean}
     */
    function busy(index) {
        for (let i = index % itemAmount; i < length; i += itemAmount) {
            if (output[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Format output
     * @param {number[]} combination
     * @returns {number[][]}
     */
    function format(combination) {
        return _.chunk(combination, itemAmount);
    }

    /**
     * Initialize
     */
    for (let i = 0; i < length; i++) {
        output[i] = i < itemAmount ? 1 : 0;
    }

    /**
     * Code generator
     * @returns {number[]}
     */
    return function next() {
        var sum;

        if (tick === length) {
            return null;
        }

        if (tick < 0) {
            tick++;
            return format(output, itemAmount);
        }

        if (output[tick] || busy(tick, itemAmount)) {
            output[tick] = 0;
            tick++;
            return next();
        }

        output[tick] = 1;
        sum = itemAmount;
        for (let i = tick; i < length; i++) {
            sum -= output[i];
        }
        for (let i = 0, j = 0; i < sum; i++) {
            while (busy(j, itemAmount)) {
                j++;
            }
            output[j++] = 1;
        }
        tick = 0;

        return format(output, itemAmount);
    };
};