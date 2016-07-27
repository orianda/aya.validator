'use strict';

var _ = require('lodash'),
    FSM = require('../fsm'),
    test = require('../test'),
    atom = require('./atom');

/**
 * Create fsm for number type
 * @param {Object} props
 * @param {number} [props.min]
 * @param {number} [props.minInclusive]
 * @param {number} [props.minExclusive]
 * @param {number} [props.max]
 * @param {number} [props.maxInclusive]
 * @param {number} [props.maxExclusive]
 * @param {number} [props.truth]
 * @param {number} [props.step]
 * @param {number} [props.base=0]
 * @returns {FSM}
 */
module.exports = function (props) {
    var fsm = new FSM('string');
    fsm.string = FSM.fork(_.isString, 'trim', 'number');
    fsm.trim = FSM.turn(_.trim, 'cast');
    fsm.cast = FSM.turn(parseFloat, 'number');
    fsm.number = FSM.test(_.isFinite, 'type', 'range');
    fsm.range = FSM.range(_.identity, props, '', 'truth');
    fsm.truth = FSM.test(_.isUndefined(props.truth) ? test.pass : test.truth(props.truth), 'truth', 'step');
    fsm.step = FSM.test(_.isUndefined(props.step) ? test.pass : test.step(props.step, props.base || 0), 'step');
    return atom(props, fsm);
};