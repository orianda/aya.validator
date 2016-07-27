'use strict';

var _ = require('lodash'),
    FSM = require('../fsm'),
    test = require('../test');

/**
 * Create fsm for string type
 * @param {Object} props
 * @param {boolean} [props.required=false]
 * @param {boolean} [props.negate=false]
 * @param {FSM} [core]
 * @returns {FSM}
 */
module.exports = function (props, core) {
    var fsm = new FSM('empty');
    fsm.empty = FSM.fork(_.isUndefined, 'required', 'core');
    fsm.required = FSM.test(props.required ? test.fail : test.pass, 'required');
    fsm.core = core ? FSM.wrap(core) : FSM.goto();
    return fsm;
};