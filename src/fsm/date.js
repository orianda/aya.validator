'use strict';

var _ = require('lodash'),
    FSM = require('../fsm'),
    test = require('../test'),
    any = require('../type/any');

/**
 * Create fsm for date type
 * @param {Object} props
 * @param {number} [props.min]
 * @param {number} [props.minInclusive]
 * @param {number} [props.minExclusive]
 * @param {number} [props.max]
 * @param {number} [props.maxInclusive]
 * @param {number} [props.maxExclusive]
 * @param {number} [props.step]
 * @param {string[]} [props.options]
 * @param {Function} decode
 * @param {Function} encode
 * @param {number} factor
 * @param {number} step
 * @param {number} base
 * @returns {FSM}
 */
module.exports = function (props, decode, encode, factor, step, base) {
    var fsm = new FSM('type');
    fsm.type = FSM.test(test.collection([_.isString, _.isFinite, test.instance(Date)]), 'type', 'decode');
    fsm.decode = FSM.turn(decode, 'number');
    fsm.number = FSM.test(_.isFinite, 'type', 'range');
    fsm.range = FSM.range(_.identity, {
        min: props.min && decode(props.min),
        minInclusive: props.minInclusive,
        minExclusive: props.minExclusive,
        max: props.max && decode(props.max),
        maxInclusive: props.maxInclusive,
        maxExclusive: props.maxExclusive
    }, '', 'step');
    fsm.step = FSM.test(test.step((props.step || step) * factor, base), 'step', 'encode');
    fsm.encode = FSM.turn(encode, 'options');
    fsm.options = FSM.test(props.options ? test.contains(_.map(_.map(props.options, decode), encode)) : test.pass, 'option');
    return any(props, fsm);
};