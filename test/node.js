'use strict';

var _ = require('lodash'),
    chai = require('chai'),
    expect = chai.expect;

chai.use(require('chai-as-promised'));

describe('node', function () {
    var validate = require('../src');

    describe('type', function () {
        var config = {
            type: 'node'
        };
        [undefined, {}, []].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: value,
                    valid: true,
                    error: undefined
                });
            });
        });
        ['', '1', '1234567890', 1, 1234567890, true, false, NaN, Infinity, null].forEach(function (value) {
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
            type: 'node',
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
        [[], {}].forEach(function (value) {
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
                type: 'node',
                [threshold + 'Length']: 5
            };
            describe(threshold ? threshold : 'none', function () {
                [[], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]].forEach(function (value, index) {
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
                                        type: 'node',
                                        [threshold + 'Length']: 5,
                                        [threshold + 'LengthInclusive']: inclusive,
                                        [threshold + 'LengthExclusive']: exclusive
                                    },
                                    value = [1, 2, 3, 4, 5],
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
});