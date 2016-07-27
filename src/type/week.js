'use strict';

var turn = require('../turn'),
    date = require('../fsm/date');

/**
 * Create fsm for date type
 * @param {Object} props
 * @returns {FSM}
 */
module.exports = function (props) {
    return date(props, turn.timestamp, turn.week, 7 * 24 * 60 * 60, 1, 4 * 24 * 60 * 60);
};