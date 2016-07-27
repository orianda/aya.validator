'use strict';

var _ = require('lodash'),
    chai = require('chai'),
    expect = chai.expect;

chai.use(require('chai-as-promised'));

describe('map', function () {
    var validate = require('../src');

    describe('type', function () {
        var config = {
            type: 'map'
        };
        [undefined, [], {}].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: value && {},
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
            type: 'map',
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
                    value: {},
                    valid: true,
                    error: undefined
                });
            });
        });
    });

    describe('node', function () {
        describe('unknown', function () {
            var config = {
                type: 'map'
            };
            it('should pass', function () {
                var value = {},
                    issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: value,
                    valid: true,
                    error: undefined
                });
            });
            describe('strict flag', function () {
                it('should fail', function () {
                    var value = {unknown: 'unknown'},
                        confg = _.extend({strict: true}, config),
                        issue = validate(confg)(value);
                    expect(issue).to.deep.equal({
                        value: value,
                        valid: false,
                        error: value
                    });
                });
                it('should pass', function () {
                    var value = {unknown: 'unknown'},
                        confg = _.extend({strict: false}, config),
                        issue = validate(confg)(value);
                    expect(issue).to.deep.equal({
                        value: {},
                        valid: true,
                        error: undefined
                    });
                });
            });
        });
        describe('missing', function () {
            var config = {
                type: 'map',
                node: {any: {}}
            };
            it('should pass', function () {
                var value = {any: 'any'},
                    issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: value,
                    valid: true,
                    error: undefined
                });
            });
        });
        describe('required missing', function () {
            var config = {
                type: 'map',
                node: {any: {required: true}}
            };
            it('should pass', function () {
                var value = {any: 'any'},
                    issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: value,
                    valid: true,
                    error: undefined
                });
            });
            it('should fail', function () {
                var value = {},
                    issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: value,
                    valid: false,
                    error: {any: 'required'}
                });
            });
        });
    });
});