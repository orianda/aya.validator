'use strict';

const FORMAT = 'YYYY-MM-DD\THH:mm:ss.n';

var _ = require('lodash'),
    chai = require('chai'),
    expect = chai.expect,
    momento = require('../src/util/momento');

chai.use(require('chai-as-promised'));

describe('datetime', function () {
    var validate = require('../src');

    describe('type', function () {
        var config = {
            type: 'datetime'
        };
        [
            undefined,
            '1', '1234567890', '123 ', ' 123', ' 123 ',
            0, 1, 1234567890,
            '1212-12-12 12:12:12.1212+12:12', ' 1212-12-12 12:12:12.1212+12:12 ',
            '1212-12-12T12:12:12.1212+12:12', ' 1212-12-12T12:12:12.1212+12:12 ',
            new Date(), new Date(0)
        ].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: _.isUndefined(value) ? value : momento.parse(value).format(FORMAT),
                    valid: true,
                    error: undefined
                });
            });
        });
        [true, false, '', NaN, Infinity, null, {}, [], new Date('')].forEach(function (value) {
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
            type: 'datetime',
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
        [
            '1', '1234567890', '123 ', ' 123', ' 123 ',
            0, 1, 1234567890,
            '1212-12-12 12:12:12.1212+12:12', ' 1212-12-12 12:12:12.1212+12:12 ',
            '1212-12-12T12:12:12.1212+12:12', ' 1212-12-12T12:12:12.1212+12:12 ',
            new Date(), new Date(0)
        ].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: _.isUndefined(value) ? value : momento.parse(value).format(FORMAT),
                    valid: true,
                    error: undefined
                });
            });
        });
    });

    describe('range', function () {
        ['', 'min', 'max'].forEach(function (threshold) {
            var config = {
                type: 'datetime',
                [threshold]: '1111-11-11T11:11:11.11+11:11'
            };
            describe(threshold ? threshold : 'none', function () {
                [
                    '1010-10-10T10:10:10.10+10:10',
                    '1212-12-12T12:12:12.12+12:12'
                ].forEach(function (value, index) {
                    var pass = !threshold || (index % 2 ? threshold === 'min' : threshold === 'max');
                    describe('value = ' + value, function () {
                        it('should ' + (pass ? 'pass' : 'fail'), function () {
                            var issue = validate(config)(value);
                            expect(issue).to.deep.equal({
                                value: pass ? momento.parse(value).format(FORMAT) : momento.parse(value).timestamp(),
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
                                        type: 'datetime',
                                        [threshold]: '1212-12-12T12:12:12.12+12:12',
                                        [threshold + 'Inclusive']: inclusive,
                                        [threshold + 'Exclusive']: exclusive
                                    },
                                    value = '1212-12-12T12:12:12.12+12:12',
                                    pass = _.isUndefined(inclusive) ? !exclusive : inclusive;
                                it('should ' + (pass ? 'pass' : 'fail'), function () {
                                    var issue = validate(config)(value);
                                    expect(issue).to.deep.equal({
                                        value: pass ? momento.parse(value).format(FORMAT) : momento.parse(value).timestamp(),
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
            type: 'datetime',
            step: 10
        };
        [
            '1010-10-10T10:10:10+10:10',
            '1212-12-12T12:12:12+12:12'
        ].forEach(function (value, index) {
            var pass = index % 2 === 0;
            describe('value = ' + value, function () {
                it('should ' + (pass ? 'pass' : 'fail'), function () {
                    var issue = validate(config)(value);
                    expect(issue).to.deep.equal({
                        value: pass ? momento.parse(value).format(FORMAT) : momento.parse(value).timestamp(),
                        valid: pass,
                        error: pass ? undefined : 'step'
                    });
                });
            });
        });
    });

    describe('options', function () {
        var config = {
            type: 'datetime',
            options: [
                '1010-10-10T10:10:10.10+10:10',
                '1212-12-12T12:12:12.12+12:12'
            ]
        };
        [
            '1010-10-10T10:10:10.10+10:10',
            '1111-11-11T11:11:11.11+11:11',
            '1212-12-12T12:12:12.12+12:12'
        ].forEach(function (value, index) {
            var pass = index % 2 === 0;
            describe('value = ' + value, function () {
                it('should ' + (pass ? 'pass' : 'fail'), function () {
                    var issue = validate(config)(value);
                    expect(issue).to.deep.equal({
                        value: momento.parse(value).format(FORMAT),
                        valid: pass,
                        error: pass ? undefined : 'option'
                    });
                });
            });
        });
    });
});