'use strict';

var type = require('./type');

/**
 * Create validator
 * @param {Object} config
 * @returns {Function}
 */
module.exports = function (config) {
    var fsm = type(config);

    /**
     * Validate
     * @param {*} value
     * @returns {Object}
     */
    return function (value) {
        return fsm.run(value);
    };
};