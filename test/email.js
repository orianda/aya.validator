'use strict';

var _ = require('lodash'),
    chai = require('chai'),
    expect = chai.expect;

chai.use(require('chai-as-promised'));

describe('email', function () {
    var validate = require('../src');

    describe('type', function () {
        var config = {
            type: 'email'
        };
        [undefined, 'info@example.de'].forEach(function (value) {
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
        ['', '1', '1234567890', 1, 1234567890].forEach(function (value) {
            it('should fail ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: value.toString(),
                    valid: false,
                    error: 'email'
                });
            });
        });
    });

    describe('required', function () {
        var config = {
            type: 'email',
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
        ['info@example.de'].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: value,
                    valid: true,
                    error: undefined
                });
            });
        });
    });

    describe('length', function () {
        ['', 'min', 'max'].forEach(function (threshold) {
            var config = {
                type: 'email',
                [threshold + 'Length']: 5
            };
            describe(threshold ? threshold : 'none', function () {
                ['e@e', 'info@example.de'].forEach(function (value, index) {
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
                                        type: 'email',
                                        [threshold + 'Length']: 15,
                                        [threshold + 'LengthInclusive']: inclusive,
                                        [threshold + 'LengthExclusive']: exclusive
                                    },
                                    value = 'info@example.de',
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
            type: 'email',
            pattern: /^[a-z]+@[a-z]+$/
        };
        ['info@example'].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: _.isUndefined(value) ? value : value.toString(),
                    valid: true,
                    error: undefined
                });
            });
        });
        ['info@example.de', 'in-fo@example', 'info12@example', 'info@12example', 'info@example-de'].forEach(function (value) {
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
            type: 'email',
            options: ['pass@example.de']
        };
        it('should pass', function () {
            var issue = validate(config)('pass@example.de');
            expect(issue).to.deep.equal({
                value: 'pass@example.de',
                valid: true,
                error: undefined
            });
        });
        it('should fail', function () {
            var issue = validate(config)('fail@example.de');
            expect(issue).to.deep.equal({
                value: 'fail@example.de',
                valid: false,
                error: 'option'
            });
        });
    });
});