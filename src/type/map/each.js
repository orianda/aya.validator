'use strict';

var _ = require('lodash'),
    type = require('../../type');

/**
 * Test each map value
 * @param {Object} node
 * @param {boolean} [strict=false]
 * @param {string} [pass]
 * @param {string} [fail]
 * @returns {Function}
 */
module.exports = function (node, strict, pass, fail) {
    node = _.mapValues(node, type);

    /**
     * FSM step
     * @param {Object} issue
     * @param {Object} issue.value
     * @returns {string}
     */
    return function (issue) {
        var match, unknown, missing, total;

        match = _.pickBy(issue.value, function (value, key) {
            return node[key];
        });
        match = _.mapValues(match, function (value, key) {
            return node[key].run(value);
        });

        missing = _.pickBy(node, function (fsm, key) {
            return _.isUndefined(issue.value[key]);
        });
        missing = _.mapValues(missing, function (fsm) {
            return fsm.run(undefined);
        });

        unknown = _.omitBy(issue.value, function (value, key) {
            return node[key];
        });
        unknown = _.mapValues(unknown, function (value) {
            return {
                value: value,
                valid: !strict,
                error: !strict ? undefined : 'unknown'
            };
        });

        total = _.extend(match, unknown, missing);
        issue.value = _.mapValues(total, 'value');
        issue.value = _.omitBy(issue.value, _.isUndefined);
        issue.valid = _.every(total, 'valid');
        issue.error = _.mapValues(total, 'error');
        issue.error = _.omitBy(issue.error, _.isUndefined);
        issue.error = _.isEmpty(issue.error) ? undefined : issue.error;
        return issue.valid ? pass : fail;
    };
};