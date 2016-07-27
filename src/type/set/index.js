'use strict';

var _ = require('lodash'),
    FSM = require('../../fsm'),
    node = require('../../type/node'),
    each = require('./each');

/**
 * Create fsm for number type
 * @param {Object} props
 * @param {Object[]} props.node
 * @returns {FSM}
 */
module.exports = function (props) {
    var fsm = new FSM('type');
    fsm.type = FSM.test(_.isArray, 'type', 'each');
    fsm.each = each(props.node);
    return node(props, fsm);
};