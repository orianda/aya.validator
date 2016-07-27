'use strict';

var _ = require('lodash'),
    FSM = require('../../fsm'),
    any = require('./../any'),
    count = require('./count');

/**
 * Create fsm for node type
 * @param {Object} props
 * @param {FSM} [core]
 * @returns {FSM}
 */
module.exports = function (props, core) {
    var fsm = new FSM('type');
    fsm.type = FSM.test(_.isObject, 'type', 'length');
    fsm.length = FSM.range(count, props, 'length', 'core');
    fsm.core = core ? FSM.wrap(core) : FSM.goto();
    return any(props, fsm);
};