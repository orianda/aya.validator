'use strict';

var _ = require('lodash');

/**
 * Reducer
 * @param {number} total
 * @param {*} value
 * @returns {number}
 */
function add(total, value) {
    var increase = _.isUndefined(value) ? 0 : 1;
    return total + increase;
}

/**
 * Count not undefined values
 * @param {Object} node
 * @returns {number}
 */
module.exports = function (node) {
    return _.reduce(node, add, 0);
};