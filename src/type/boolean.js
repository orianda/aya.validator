'use strict';

var _ = require('lodash'),
    FSM = require('../fsm'),
    test = require('../test'),
    turn = require('../turn'),
    atom = require('./atom');

/**
 * Create fsm for boolean type
 * @param {Object} props
 * @param {boolean} [props.strict=false]
 * @returns {FSM}
 */
module.exports = function (props) {
    var fsm = new FSM('stringable');
    fsm.stringable = FSM.fork(test.collection([_.isString, _.isNumber]), 'cast', 'type');
    fsm.cast = props.strict ? FSM.goto('type') : FSM.turn(turn.boolean, 'type');
    fsm.type = FSM.test(_.isBoolean, 'type');
    return atom(props, fsm);
};