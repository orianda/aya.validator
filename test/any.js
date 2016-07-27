'use strict';

var chai = require('chai'),
    expect = chai.expect;

chai.use(require('chai-as-promised'));

describe('any', function () {
    var validate = require('../src');

    describe('type', function () {
        var config = {
            type: 'any'
        };
        [undefined, '', '1', NaN, 1, Infinity, true, false, null, [], {}].forEach(function (value) {
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

    describe('required', function () {
        var config = {
            type: 'any',
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
        ['', '1', NaN, 1, Infinity, true, false, null, [], {}].forEach(function (value) {
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

    describe('fallback', function () {
        var config = {};
        [undefined, '', '1', NaN, 1, Infinity, true, false, null, [], {}].forEach(function (value) {
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
});