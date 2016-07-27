'use strict';

var _ = require('lodash'),
    chai = require('chai'),
    expect = chai.expect;

chai.use(require('chai-as-promised'));

describe('string', function () {
    var validate = require('../src');

    describe('type', function () {
        var config = {
            type: 'string'
        };
        [undefined, '', '1', '1234567890', 1, 1234567890].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: _.isUndefined(value) ? value : value.toString(),
                    valid: true,
                    error: undefined
                });
            });
        });
        [true, false, NaN, Infinity, null, {}, []].forEach(function (value) {
            it('should fail ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: value,
                    valid: false,
                    error: 'type'
                });
            });
        });
    });

    describe('required', function () {
        var config = {
            type: 'string',
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
        ['', '1', '1234567890', 1, 1234567890].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: value.toString(),
                    valid: true,
                    error: undefined
                });
            });
        });
    });

    describe('trim', function () {
        it('should trim', function () {
            var config = {
                    type: 'string',
                    trim: true
                },
                value = ' hallo ',
                issue = validate(config)(value);
            expect(issue).to.deep.equal({
                value: value.trim(),
                valid: true,
                error: undefined
            });
        });
        it('should not trim', function () {
            var config = {
                    type: 'string',
                    trim: false
                },
                value = ' hallo ',
                issue = validate(config)(value);
            expect(issue).to.deep.equal({
                value: value,
                valid: true,
                error: undefined
            });
        });
    });

    describe('length', function () {
        ['', 'min', 'max'].forEach(function (threshold) {
            var config = {
                type: 'string',
                [threshold + 'Length']: 5
            };
            describe(threshold ? threshold : 'none', function () {
                ['', '1234567890'].forEach(function (value, index) {
                    var pass = !threshold || (index % 2 ? threshold === 'min' : threshold === 'max');
                    describe('length = ' + value.length, function () {
                        it('should ' + (pass ? 'pass' : 'fail'), function () {
                            var issue = validate(config)(value);
                            expect(issue).to.deep.equal({
                                value: value,
                                valid: pass,
                                error: pass ? undefined : threshold + 'Length'
                            });
                        });
                    });
                });
            });
        });
        describe('inclusive + exclusive', function () {
            ['min', 'max'].forEach(function (threshold) {
                describe(threshold + 'Length', function () {
                    [undefined, false, true].forEach(function (inclusive) {
                        [undefined, false, true].forEach(function (exclusive) {
                            describe('inclusive = ' + inclusive + '; exclusive = ' + exclusive, function () {
                                var config = {
                                        type: 'string',
                                        [threshold + 'Length']: 5,
                                        [threshold + 'LengthInclusive']: inclusive,
                                        [threshold + 'LengthExclusive']: exclusive
                                    },
                                    value = '12345',
                                    pass = _.isUndefined(inclusive) ? !exclusive : inclusive;
                                it('should ' + (pass ? 'pass' : 'fail'), function () {
                                    var issue = validate(config)(value);
                                    expect(issue).to.deep.equal({
                                        value: value,
                                        valid: pass,
                                        error: pass ? undefined : threshold + 'Length'
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    describe('pattern', function () {
        var config = {
            type: 'string',
            pattern: /^\d+$/
        };
        [undefined, '1', '1234567890', 1, 1234567890].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: _.isUndefined(value) ? value : value.toString(),
                    valid: true,
                    error: undefined
                });
            });
        });
        ['', 'abzd', 'a12345', '12345a', '12.34', 12.34, 1E-1].forEach(function (value) {
            it('should fail ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: value.toString(),
                    valid: false,
                    error: 'pattern'
                });
            });
        });
    });

    describe('options', function () {
        var config = {
            type: 'string',
            options: ['pass']
        };
        it('should pass', function () {
            var issue = validate(config)('pass');
            expect(issue).to.deep.equal({
                value: 'pass',
                valid: true,
                error: undefined
            });
        });
        it('should fail', function () {
            var issue = validate(config)('fail');
            expect(issue).to.deep.equal({
                value: 'fail',
                valid: false,
                error: 'option'
            });
        });
    });
});