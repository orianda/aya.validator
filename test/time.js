'use strict';

var _ = require('lodash'),
    chai = require('chai'),
    expect = chai.expect,
    momento = require('../src/util/momento');

chai.use(require('chai-as-promised'));

describe('time', function () {
    var validate = require('../src');

    /**
     * Converts months into string
     * @param {*} value
     * @returns {number|string}
     */
    function normalize(value) {
        var hours, minutes, seconds;
        seconds = momento.parse(value).timestamp();
        if (isNaN(seconds)) {
            return seconds;
        }
        hours = Math.floor(seconds / 60 / 60);
        seconds -= hours * 60 * 60;
        minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;
        return (hours < 10 ? '0' : '') + hours + ':' +
            String(minutes + 100).substring(1) + ':' +
            String(seconds + 100).substring(1);
    }

    describe('type', function () {
        var config = {
            type: 'time'
        };
        [
            undefined,
            '1', '1234567890', '123 ', ' 123', ' 123 ',
            0, 1, 1234567890,
            '12:12:12.1212+12:12', ' 12:12:12.1212+12:12 ',
            new Date(), new Date(0)
        ].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: _.isUndefined(value) ? value : normalize(value),
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
            type: 'time',
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
            '12:12:12.1212+12:12', ' 12:12:12.1212+12:12 ',
            new Date(), new Date(0)
        ].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: _.isUndefined(value) ? value : normalize(value),
                    valid: true,
                    error: undefined
                });
            });
        });
    });

    describe('range', function () {
        ['', 'min', 'max'].forEach(function (threshold) {
            var config = {
                type: 'time',
                [threshold]: '12:12:12.12+12:12'
            };
            describe(threshold ? threshold : 'none', function () {
                [
                    '11:11:11.11+11:11',
                    '13:13:13.13+13:13'
                ].forEach(function (value, index) {
                    var pass = !threshold || (index % 2 ? threshold === 'min' : threshold === 'max');
                    describe('value = ' + value, function () {
                        it('should ' + (pass ? 'pass' : 'fail'), function () {
                            var issue = validate(config)(value);
                            expect(issue).to.deep.equal({
                                value: pass ? normalize(value) : momento.parse(value).timestamp(),
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
                                        type: 'time',
                                        [threshold]: '12:12:12.12+12:12',
                                        [threshold + 'Inclusive']: inclusive,
                                        [threshold + 'Exclusive']: exclusive
                                    },
                                    value = '12:12:12.12+12:12',
                                    pass = _.isUndefined(inclusive) ? !exclusive : inclusive;
                                it('should ' + (pass ? 'pass' : 'fail'), function () {
                                    var issue = validate(config)(value);
                                    expect(issue).to.deep.equal({
                                        value: pass ? normalize(value) : momento.parse(value).timestamp(),
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
            type: 'time',
            step: 10
        };
        [
            '10:10:10+10:10',
            '13:13:13+13:13'
        ].forEach(function (value, index) {
            var pass = index % 2 === 0;
            describe('value = ' + value, function () {
                it('should ' + (pass ? 'pass' : 'fail'), function () {
                    var issue = validate(config)(value);
                    expect(issue).to.deep.equal({
                        value: pass ? normalize(value) : momento.parse(value).timestamp(),
                        valid: pass,
                        error: pass ? undefined : 'step'
                    });
                });
            });
        });
    });

    describe('options', function () {
        var config = {
            type: 'time',
            options: [
                '10:10:10.10+10:10',
                '12:12:12.12+12:12'
            ]
        };
        [
            '10:10:10.10+10:10',
            '11:11:11.11+11:11',
            '12:12:12.12+12:12',
            '13:13:13.13+13:13'
        ].forEach(function (value, index) {
            var pass = index % 2 === 0;
            describe('value = ' + value, function () {
                it('should ' + (pass ? 'pass' : 'fail'), function () {
                    var issue = validate(config)(value);
                    expect(issue).to.deep.equal({
                        value: normalize(value),
                        valid: pass,
                        error: pass ? undefined : 'option'
                    });
                });
            });
        });
    });
});