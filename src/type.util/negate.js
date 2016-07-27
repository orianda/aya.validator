'use strict';

var FSM = require('../fsm');

/**
 * Create fsm for string type
 * @param {Object} props
 * @param {boolean} [props.required=false]
 * @param {boolean} [props.negate=false]
 * @param {FSM} [core]
 * @returns {FSM}
 */
module.exports = function (props, core) {
    var fsm = new FSM('core');
    fsm.core = core ? FSM.wrap(core, 'negate', 'negate') : FSM.goto('negate');
    fsm.negate = props.negate ? FSM.not() : FSM.goto();
    return fsm;
};