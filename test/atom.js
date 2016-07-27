'use strict';

var _ = require('lodash'),
    chai = require('chai'),
    expect = chai.expect;

chai.use(require('chai-as-promised'));

describe('atom', function () {
    var validate = require('../src');

    describe('type', function () {
        var config = {
            type: 'atom'
        };
        [undefined, '', '1', '1234567890', 1, 1234567890, true, false, NaN, Infinity, null].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: value,
                    valid: true,
                    error: undefined
                });
            });
        });
        [{}, []].forEach(function (value) {
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