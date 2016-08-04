'use strict';

var FSM = require('../../fsm'),
    node = require('../node'),
    each = require('./each');

/**
 * Create fsm for number type
 * @param {Object} props
 * @param {Object} props.node
 * @param {boolean} [props.strict=false]
 * @returns {FSM}
 */
module.exports = function (props) {
    var fsm = new FSM('each');
    fsm.each = each(props.node, props.strict);
    return node(props, fsm);
};