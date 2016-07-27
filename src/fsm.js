'use strict';

/**
 * Start and end states for fsm
 */
const START = 'start';
const END = 'end';

/**
 * Fsm creator
 * @param {string} [start]
 * @returns {FSM}
 * @constructor
 */
function FSM(start) {

    if (!(this instanceof FSM)) {
        return new FSM(start);
    }

    this[START] = FSM.goto(start);
}

/**
 * Run fsm against value
 * @param {*} value
 * @returns {Object}
 */
FSM.prototype.run = function (value) {
    var step = START,
        issue = {};
    issue.value = value;
    issue.valid = true;
    issue.error = undefined;

    while (step !== END) {
        let task = this[step];
        if (!task) {
            throw {
                message: 'Unknown step ' + step,
                step: step
            };
        }
        step = task(issue) || END;
    }

    return issue;
};

/**
 * Module export
 * @type {FSM}
 */
module.exports = FSM;

/**
 * Expose start and end states
 */
FSM.START = START;
FSM.END = END;

/**
 * Create negate step
 * @param {string} [next]
 * @returns {Function}
 */
FSM.not = function (next) {
    return function (issue) {
        issue.valid = !issue.valid;
        return next;
    };
};

/**
 * Create wrap step
 * @param {FSM} fsm
 * @param {string} [pass]
 * @param {string} [fail]
 * @returns {Function}
 */
FSM.wrap = function (fsm, pass, fail) {
    return function (issue) {
        var i = fsm.run(issue.value);
        issue.value = i.value;
        issue.valid = i.valid && issue.valid;
        issue.error = i.error || issue.error;
        if (i.occur) {
            issue.occur = i.occur;
        }
        return issue.valid ? pass : fail;
    };
};

/**
 * Create test step
 * @param {Function} test
 * @param {string} report
 * @param {string} [next]
 * @returns {Function}
 */
FSM.test = function (test, report, next) {
    return function (issue) {
        if (test(issue.value)) {
            return next;
        }
        issue.valid = false;
        issue.error = report;
        return END;
    };
};

/**
 * Create forward step
 * @param {string} [next]
 * @returns {Function}
 */
FSM.goto = function (next) {
    return function () {
        return next;
    };
};

/**
 * Create fork step
 * @param {Function} test
 * @param {string} [pass]
 * @param {string} [fail]
 * @returns {Function}
 */
FSM.fork = function (test, pass, fail) {
    return function (issue) {
        return test(issue.value) ? pass : fail;
    };
};

/**
 * Create converter step
 * @param {Function} turn
 * @param {string} [next]
 * @returns {Function}
 */
FSM.turn = function (turn, next) {
    return function (issue) {
        issue.value = turn(issue.value);
        return next;
    };
};

/**
 * Create range step
 * @type {Function}
 */
FSM.range = require('./fsm/range');