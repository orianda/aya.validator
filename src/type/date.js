'use strict';

const FORMAT = 'YYYY-MM-DD';

var turn = require('../turn'),
    date = require('../fsm/date');

/**
 * Create fsm for date type
 * @param {Object} props
 * @returns {FSM}
 */
module.exports = function (props) {
    return date(props, turn.timestamp, turn.format(FORMAT), 24 * 60 * 60, 1, 0);
};