'use strict';

var _ = require('lodash'),
    FSM = require('../fsm'),
    node = require('../type/node');

/**
 * Each test factory
 * @param {FSM} fsm
 * @param {string} [pass]
 * @param {string} [fail]
 * @returns {Function}
 */
function each(fsm, pass, fail) {

    /**
     * Each test
     * @param {Object} issue
     * @returns {string|undefined}
     */
    return function (issue) {
        var issues = _.map(issue.value, value => fsm.run(value));

        issue.value = _.map(issues, 'value');
        issue.value = issue.value.slice(0, issue.value.reduce((length, value, index) => _.isUndefined(value) ? length : index + 1, 0));
        issue.error = _.map(issues, 'error');
        issue.error = issue.error.slice(0, issue.error.reduce((length, error, index) => _.isUndefined(error) ? length : index + 1, 0));
        issue.error = issue.error.length ? issue.error : undefined;
        issue.valid = _.every(issues, 'valid');
        return issue.valid ? pass : fail;
    };
}

/**
 * Reformat multiple props
 * @param {FSM} [core]
 * @returns {FSM}
 */
module.exports = function (core) {
    var wrap = new FSM('type');
    wrap.type = FSM.test(_.isArray, 'type', 'each');
    wrap.each = core ? each(core) : FSM.goto();
    return node({}, wrap);
};