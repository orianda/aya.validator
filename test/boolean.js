'use strict';

var chai = require('chai'),
    expect = chai.expect;

chai.use(require('chai-as-promised'));

describe('boolean', function () {
    var validate = require('../src');

    describe('type', function () {
        var config = {
            type: 'boolean'
        };
        [undefined].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: value,
                    valid: true,
                    error: undefined
                });
            });
        });
        ['1', 'true', 'on', 'yes', 1, Infinity, true].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: true,
                    valid: true,
                    error: undefined
                });
            });
        });
        ['', '0', 'false', 'off', 'no', NaN, 0, false].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: false,
                    valid: true,
                    error: undefined
                });
            });
        });
        [null, [], {}].forEach(function (value) {
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
            type: 'boolean',
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
        [true, false].forEach(function (value) {
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

    describe('alias', function () {
        var config = {
            type: 'bool'
        };
        [undefined].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: value,
                    valid: true,
                    error: undefined
                });
            });
        });
        ['1', 'true', 'on', 'yes', 1, Infinity, true].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: true,
                    valid: true,
                    error: undefined
                });
            });
        });
        ['', '0', 'false', 'off', 'no', NaN, 0, false].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: false,
                    valid: true,
                    error: undefined
                });
            });
        });
        [null, [], {}].forEach(function (value) {
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

    describe('options', function () {
        var config = {
            type: 'boolean',
            options: [true]
        };
        it('should pass', function () {
            var issue = validate(config)(true);
            expect(issue).to.deep.equal({
                value: true,
                valid: true,
                error: undefined
            });
        });
        it('should fail', function () {
            var issue = validate(config)(false);
            expect(issue).to.deep.equal({
                value: false,
                valid: false,
                error: 'option'
            });
        });
    });
});