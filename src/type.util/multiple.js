'use strict';

var _ = require('lodash');

/**
 * Reformat multiple props
 * @param {Object} props
 * @param {boolean} [props.multiple=false]
 * @param {boolean} [props.required=false]
 * @param {number} [props.minAmount=1]
 * @param {number} [props.maxAmount=1]
 * @param {boolean} [props.negate=false]
 * @returns {Object}
 */
module.exports = function (props) {
    if (!props.multiple) {
        return props;
    }

    return {
        type: 'set',
        required: props.required,
        minLength: props.minAmount,
        maxLength: props.maxAmount,
        node: [_.extend({}, props, {
            multiple: false,
            required: false,
            negate: false
        })],
        negate: props.negate
    };
};