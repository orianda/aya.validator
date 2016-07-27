'use strict';

var _ = require('lodash'),
    FSM = require('../fsm'),
    test = require('../test');

/**
 * Create step to test range of value
 * @param {Function} getter
 * @param {Object} props
 * @param {string} prop
 * @param {string} [next]
 * @returns {Function}
 */
module.exports = function (getter, props, prop, next) {
    var fsm, min, max, minProp, maxProp, minInclusive, maxInclusive, minExclusive, maxExclusive, minTest, maxTest;

    prop = _.capitalize(prop);
    minProp = 'min' + prop;
    maxProp = 'max' + prop;
    min = props[minProp];
    max = props[maxProp];
    if (max < min) {
        let tmpLimit, tmpProp;
        tmpLimit = min;
        min = max;
        max = tmpLimit;
        tmpProp = minProp;
        minProp = maxProp;
        maxProp = tmpProp;
    }

    fsm = new FSM('get');
    fsm.get = FSM.turn(getter, 'min');

    minInclusive = props[minProp + 'Inclusive'];
    minExclusive = props[minProp + 'Exclusive'];
    minInclusive = !_.isUndefined(minInclusive) ? minInclusive : !minExclusive;
    minTest = _.isUndefined(min) ? test.pass : test.gt(min, minInclusive);
    fsm.min = FSM.test(minTest, minProp, 'max');

    maxInclusive = props[maxProp + 'Inclusive'];
    maxExclusive = props[maxProp + 'Exclusive'];
    maxInclusive = !_.isUndefined(maxInclusive) ? maxInclusive : !maxExclusive;
    maxTest = _.isUndefined(max) ? test.pass : test.lt(max, maxInclusive);
    fsm.max = FSM.test(maxTest, maxProp);

    /**
     * FSM step to run against the internal fsm
     * @param {Object} issue
     * @param {*} issue.value
     * @param {string|undefined} issue.error
     * @returns {string|undefined}
     */
    return function (issue) {
        var i = fsm.run(issue.value);
        issue.valid = i.valid && issue.valid;
        issue.error = i.error || issue.error;
        return i.valid ? next : FSM.END;
    };
};