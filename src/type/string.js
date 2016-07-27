'use strict';

var _ = require('lodash'),
    FSM = require('../fsm'),
    test = require('../test'),
    atom = require('./atom');

/**
 * Create fsm for string type
 * @param {Object} props
 * @param {boolean} [props.trim=false]
 * @param {number} [props.minLength]
 * @param {number} [props.minLengthInclusive]
 * @param {number} [props.minLengthExclusive]
 * @param {number} [props.maxLength]
 * @param {number} [props.maxLengthInclusive]
 * @param {number} [props.maxLengthExclusive]
 * @param {RegExp} [props.pattern]
 * @param {FSM} [core]
 * @returns {FSM}
 */
module.exports = function (props, core) {
    var fsm = new FSM('type');
    fsm.type = FSM.test(test.collection([_.isString, _.isFinite]), 'type', 'trim');
    fsm.trim = FSM.turn(props.trim ? _.trim : _.toString, 'length');
    fsm.length = FSM.range(_.size, props, 'length', 'pattern');
    fsm.pattern = FSM.test(props.pattern ? test.pattern(props.pattern) : test.pass, 'pattern', 'core');
    fsm.core = core ? FSM.wrap(core) : FSM.goto();
    return atom(props, fsm);
};