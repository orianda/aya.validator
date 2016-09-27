'use strict';

var FSM = require('../fsm');

/**
 * Create fsm for string type
 * @param {FSM} [core]
 * @returns {FSM}
 */
module.exports = function (core) {
    var fsm = new FSM('core');
    fsm.core = core ? FSM.wrap(core, 'negate', 'negate') : FSM.goto('negate');
    fsm.negate = FSM.not();
    return fsm;
};