'use strict';

const PATTERN = /^[^@\s]+@[^.\s]+(\.[^.\s]+)*$/;

var _ = require('lodash'),
    FSM = require('../fsm'),
    test = require('../test'),
    string = require('./string');

/**
 * Create fsm for email type
 * @param {Object} props
 * @returns {FSM}
 */
module.exports = function (props) {
    var fsm = new FSM('email');
    fsm.email = FSM.test(test.pattern(PATTERN), 'email');
    props = _.extend({}, props, {trim: true});
    return string(props, fsm);
};