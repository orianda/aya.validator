'use strict';

var _ = require('lodash'),
    chai = require('chai'),
    expect = chai.expect;

chai.use(require('chai-as-promised'));

describe('number', function () {
    var validate = require('../src');

    describe('type', function () {
        var config = {
            type: 'number'
        };
        [undefined, '1', '1234567890', '123 ', ' 123', ' 123 ', 0, 1, 1234567890].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: _.isUndefined(value) ? value : parseFloat(value),
                    valid: true,
                    error: undefined
                });
            });
        });
        [true, false, '', NaN, Infinity, null, {}, []].forEach(function (value) {
            it('should fail ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: value === '' ? NaN : value,
                    valid: false,
                    error: 'type'
                });
            });
        });
    });

    describe('required', function () {
        var config = {
            type: 'number',
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
        ['1', '1234567890', '123 ', ' 123', ' 123 ', 0, 1, 1234567890].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: parseFloat(value),
                    valid: true,
                    error: undefined
                });
            });
        });
    });

    describe('range', function () {
        ['', 'min', 'max'].forEach(function (threshold) {
            var config = {
                type: 'number',
                [threshold]: 1234
            };
            describe(threshold ? threshold : 'none', function () {
                [123, 12345].forEach(function (value, index) {
                    var pass = !threshold || (index % 2 ? threshold === 'min' : threshold === 'max');
                    describe('value = ' + value, function () {
                        it('should ' + (pass ? 'pass' : 'fail'), function () {
                            var issue = validate(config)(value);
                            expect(issue).to.deep.equal({
                                value: value,
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
                                        type: 'number',
                                        [threshold]: 123,
                                        [threshold + 'Inclusive']: inclusive,
                                        [threshold + 'Exclusive']: exclusive
                                    },
                                    value = 123,
                                    pass = _.isUndefined(inclusive) ? !exclusive : inclusive;
                                it('should ' + (pass ? 'pass' : 'fail'), function () {
                                    var issue = validate(config)(value);
                                    expect(issue).to.deep.equal({
                                        value: value,
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

    describe('truth', function () {
        var config = {
            type: 'number',
            truth: 0
        };
        [0, 1, 1.1, 1.1e1, 1.1e0, 1.1e-1].forEach(function (value) {
            var pass = value % 1 === 0;
            it('should ' + (pass ? 'pass' : 'fail') + ' for ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: value,
                    valid: pass,
                    error: pass ? undefined : 'truth'
                });
            });
        });
    });

    describe('step', function () {
        it('should pass', function () {
            var config = {
                    type: 'number',
                    step: 1
                },
                value = 10,
                issue = validate(config)(value);
            expect(issue).to.deep.equal({
                value: value,
                valid: true,
                error: undefined
            });
        });
        it('should fail', function () {
            var config = {
                    type: 'number',
                    step: 3
                },
                value = 10,
                issue = validate(config)(value);
            expect(issue).to.deep.equal({
                value: value,
                valid: false,
                error: 'step'
            });
        });
        it('should pass agein', function () {
            var config = {
                    type: 'number',
                    step: 3,
                    base: 1
                },
                value = 10,
                issue = validate(config)(value);
            expect(issue).to.deep.equal({
                value: value,
                valid: true,
                error: undefined
            });
        });
    });

    describe('options', function () {
        var config = {
            type: 'number',
            options: [1]
        };
        it('should pass', function () {
            var issue = validate(config)(1);
            expect(issue).to.deep.equal({
                value: 1,
                valid: true,
                error: undefined
            });
        });
        it('should fail', function () {
            var issue = validate(config)(0);
            expect(issue).to.deep.equal({
                value: 0,
                valid: false,
                error: 'option'
            });
        });
    });
});