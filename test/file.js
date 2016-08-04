'use strict';

var chai = require('chai'),
    expect = chai.expect;

chai.use(require('chai-as-promised'));

describe('file', function () {
    var validate = require('../src'),
        file = {
            path: 'path',
            name: 'name',
            type: 'image/jpeg',
            size: 0
        };

    describe('type', function () {
        var config = {
            type: 'file'
        };
        [undefined, file].forEach(function (value) {
            it('should pass ' + value, function () {
                var issue = validate(config)(value);
                expect(issue).to.deep.equal({
                    value: value,
                    valid: true,
                    error: undefined
                });
            });
        });
        ['', '1', NaN, 1, Infinity, true, false, null].forEach(function (value) {
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
            type: 'file',
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
        it('should pass', function () {
            var issue = validate(config)(file);
            expect(issue).to.deep.equal({
                value: file,
                valid: true,
                error: undefined
            });
        });
    });

    describe('mime type', function () {
        it('should fail', function () {
            var config = {
                    type: 'file',
                    mime: 'image/png'
                },
                issue = validate(config)(file);
            expect(issue).to.deep.equal({
                value: file,
                valid: false,
                error: {
                    'type': 'pattern'
                }
            });
        });
        it('should pass', function () {
            var config = {
                    type: 'file',
                    mime: 'image/jpeg'
                },
                issue = validate(config)(file);
            expect(issue).to.deep.equal({
                value: file,
                valid: true,
                error: undefined
            });
        });
        it('should pass wildcard', function () {
            var config = {
                    type: 'file',
                    mime: 'image/*'
                },
                issue = validate(config)(file);
            expect(issue).to.deep.equal({
                value: file,
                valid: true,
                error: undefined
            });
        });
    });
});