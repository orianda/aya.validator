'use strict';

const PATTERN = /^#([\da-f]{3}|[\da-f]{6})$/i;

var _ = require('lodash'),
    FSM = require('../fsm'),
    test = require('../test'),
    string = require('./string');

/**
 * Create fsm for color type
 * @param {Object} props
 * @returns {FSM}
 */
module.exports = function (props) {
    var fsm = new FSM('color');
    fsm.color = FSM.test(test.pattern(PATTERN), 'color');
    props = _.extend({}, props, {trim: true});
    return string(props, fsm);
};