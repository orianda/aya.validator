'use strict';

/**
 * Fake fsm for unknown validation
 * @type {Object}
 */
module.exports = {
    run: function (value) {
        return {
            value: value,
            valid: false,
            error: 'unknown'
        };
    }
};