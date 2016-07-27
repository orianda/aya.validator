'use strict';

var _ = require('lodash'),
    type = require('../../type'),
    range = require('../../fsm/range'),
    algorithm = require('./algorithm'),
    unknown = require('./unknown');

/**
 * Occurrence execution
 * @param {Function} check
 * @param {number} value
 * @returns {string|undefined}
 */
function occurrence(check, value) {
    var issue = {
        value: value,
        valid: true,
        error: undefined
    };
    check(issue);
    return issue.valid ? undefined : issue.error;
}

/**
 * Test each set value
 * @param {Object} node
 * @param {string} [pass]
 * @param {string} [fail]
 * @returns {Function}
 */
module.exports = function (node, pass, fail) {
    var slotAmount = node.length,
        occur;

    occur = _.map(node, props => range(_.identity, props, 'occur'));
    occur.push(range(_.identity, {maxOccur: 0}, 'occur'));
    node = _.map(node, type);
    node.push(unknown);

    /**
     * FSM step
     * @param {Object} issue
     * @param {Array} issue.value
     * @returns {string}
     */
    return function (issue) {
        var itemAmount = issue.value.length,
            issueCache = node.map(fsm => issue.value.map(value => fsm.run(value))),
            emptyCache = node.map(fsm => fsm.run(undefined)),
            nextCombination = algorithm(slotAmount + 1, itemAmount),
            thisCombination = nextCombination(),
            bestScore = itemAmount + 2,
            bestIssue, bestOccur;

        while (thisCombination) {
            var thisScore = 0,
                thisIssue = new Array(itemAmount),
                thisOccur = new Array(slotAmount);

            thisCombination.forEach((slot, slotIndex) => {
                var sum = 0;

                slot.forEach((exists, itemIndex) => {
                    if (exists) {
                        let issue = issueCache[slotIndex][itemIndex];
                        thisIssue[itemIndex] = issue;
                        thisScore += issue.valid ? 0 : 1;
                        sum++;
                    }
                });

                thisOccur[slotIndex] = occurrence(occur[slotIndex], sum);
                if (thisOccur[slotIndex]) {
                    thisScore += 1;
                }

                if (sum === 0 && slotIndex < slotAmount) {
                    let issue = _.cloneDeep(emptyCache[slotIndex]);
                    thisIssue.push(issue);
                    thisScore += issue.valid ? 1 / slotAmount : 1;
                }
            });

            if (thisScore < bestScore) {
                bestScore = thisScore;
                bestIssue = thisIssue;
                bestOccur = thisOccur;
                if (thisScore === 0) {
                    break;
                }
            }

            thisCombination = nextCombination();
        }

        issue.value = _.map(bestIssue, 'value');
        issue.value = issue.value.slice(0, issue.value.reduce((length, value, index) => _.isUndefined(value) ? length : index + 1, 0));
        issue.error = _.mapValues(bestIssue, 'error');
        issue.error = _.omitBy(issue.error, _.isUndefined);
        issue.error = _.isEmpty(issue.error) ? undefined : issue.error;
        issue.occur = _.omitBy(bestOccur, _.isUndefined);
        issue.occur = _.isEmpty(issue.occur) ? undefined : issue.occur;
        issue.valid = _.isUndefined(issue.occur) && _.every(bestIssue, 'valid');
        return issue.valid ? pass : fail;
    };
};