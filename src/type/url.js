'use strict';

const PATTERN = /^[a-z0-9]+:\/\/([^.:\W\/?#]+.)*[^.:\W\/?#]+(\.[a-z0-9+-_=.%]+)*\/?(\?[a-z0-9+-_=.%]*)?(#[a-z0-9+-_=.%]*)?$/i;

var _ = require('lodash'),
    FSM = require('../fsm'),
    test = require('../test'),
    string = require('./string');

/**
 * Create fsm for url type
 * @param {Object} props
 * @returns {FSM}
 */
module.exports = function (props) {
    var fsm = new FSM('url');
    fsm.url = FSM.test(test.pattern(PATTERN), 'url');
    props = _.extend({}, props, {trim: true});
    return string(props, fsm);
};