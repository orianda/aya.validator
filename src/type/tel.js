'use strict';

const PATTERN = /^([+]|00?)[1-9][0-9]+$/i;

var _ = require('lodash'),
    FSM = require('../fsm'),
    test = require('../test'),
    string = require('./string');

/**
 * Create fsm for phone type
 * @param {Object} props
 * @returns {FSM}
 */
module.exports = function (props) {
    var fsm = new FSM('tel');
    fsm.tel = FSM.test(test.pattern(PATTERN), 'tel');
    props = _.extend({}, props, {trim: true});
    return string(props, fsm);
};