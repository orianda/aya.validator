'use strict';

var _ = require('lodash'),
    FSM = require('../fsm'),
    test = require('../test'),
    any = require('./any');

/**
 * Create fsm for number type
 * @param {Object} props
 * @param {number[]} [props.options]
 * @param {FSM} [core]
 * @returns {FSM}
 */
module.exports = function (props, core) {
    var fsm = new FSM('type');
    fsm.type = FSM.test(_.negate(_.isObject), 'type', 'core');
    fsm.core = core ? FSM.wrap(core, 'options') : FSM.goto('options');
    fsm.options = FSM.test(props.options ? test.contains(props.options) : test.pass, 'option');
    return any(props, fsm);
};