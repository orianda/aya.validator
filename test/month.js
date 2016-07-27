'use strict';

var _ = require('lodash'),
    chai = require('chai'),
    expect = chai.expect,
    momento = require('../src/util/momento');

chai.use(require('chai-as-promised'));

describe('month', function () {
    var validate = require('../src');

    /**
     * Convert month to number
     * @param {string} value
     * @returns {number}
     */
    function decode(value) {
        var date = momento.parse(value).date;
        return date.getUTCFullYear() * 12 + date.getUTCMonth();
    }

    describe('type', function () {
        var config = {
            type: 'month'
        };
        [undefined, '1212-12', ' 1212-12 '].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: value && _.trim(value),
                    valid: true,
                    error: undefined
                });
            });
        });
        [
            true, false,
            NaN, Infinity,
            null, {}, [],
            new Date('')
        ].forEach(function (value) {
            it('should fail ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: value === '' || value instanceof Date ? NaN : value,
                    valid: false,
                    error: 'type'
                });
            });
        });
    });

    describe('required', function () {
        var config = {
            type: 'month',
            required: true
        };
        it('should fail ' + undefined, function () {
            var value = undefined,
                issue = validate(config)(value);
            expect(issue).to.deep.equal({
                value: value,
                valid: false,
                error: 'required'
            });
        });
        ['1212-12', ' 1212-12 '].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: _.trim(value),
                    valid: true,
                    error: undefined
                });
            });
        });
    });

    describe('range', function () {
        ['', 'min', 'max'].forEach(function (threshold) {
            var config = {
                type: 'month',
                [threshold]: '1111-11'
            };
            describe(threshold ? threshold : 'none', function () {
                [
                    '1010-10',
                    '1212-12'
                ].forEach(function (value, index) {
                    var pass = !threshold || (index % 2 ? threshold === 'min' : threshold === 'max');
                    describe('value = ' + value, function () {
                        it('should ' + (pass ? 'pass' : 'fail'), function () {
                            var issue = validate(config)(value);
                            expect(issue).to.deep.equal({
                                value: pass ? value : decode(value),
                                valid: pass,
                                error: pass ? undefined : threshold
                            });
                        });
                    });
                });
            });
        });
        describe('inclusive + exclusive', function () {
            ['min', 'max'].forEach(function (threshold) {
                describe(threshold, function () {
                    [undefined, false, true].forEach(function (inclusive) {
                        [undefined, false, true].forEach(function (exclusive) {
                            describe('inclusive = ' + inclusive + '; exclusive = ' + exclusive, function () {
                                var config = {
                                        type: 'month',
                                        [threshold]: '1212-12',
                                        [threshold + 'Inclusive']: inclusive,
                                        [threshold + 'Exclusive']: exclusive
                                    },
                                    value = '1212-12',
                                    pass = _.isUndefined(inclusive) ? !exclusive : inclusive;
                                it('should ' + (pass ? 'pass' : 'fail'), function () {
                                    var issue = validate(config)(value);
                                    expect(issue).to.deep.equal({
                                        value: pass ? value : decode(value),
                                        valid: pass,
                                        error: pass ? undefined : threshold
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    describe('step', function () {
        var config = {
            type: 'month',
            step: 5
        };
        [
            '1010-10',
            '1212-12'
        ].forEach(function (value, index) {
            var pass = index % 2 > 0;
            describe('value = ' + value, function () {
                it('should ' + (pass ? 'pass' : 'fail'), function () {
                    var issue = validate(config)(value);
                    expect(issue).to.deep.equal({
                        value: pass ? value : decode(value),
                        valid: pass,
                        error: pass ? undefined : 'step'
                    });
                });
            });
        });
    });

    describe('options', function () {
        var config = {
            type: 'month',
            options: [
                '1010-10',
                '1212-12'
            ]
        };
        [
            '1010-10',
            '1111-11',
            '1212-12'
        ].forEach(function (value, index) {
            var pass = index % 2 === 0;
            describe('value = ' + value, function () {
                it('should ' + (pass ? 'pass' : 'fail'), function () {
                    var issue = validate(config)(value);
                    expect(issue).to.deep.equal({
                        value: value,
                        valid: pass,
                        error: pass ? undefined : 'option'
                    });
                });
            });
        });
    });
});