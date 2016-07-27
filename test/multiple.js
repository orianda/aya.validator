'use strict';

var chai = require('chai'),
    expect = chai.expect;

chai.use(require('chai-as-promised'));

describe('multiple', function () {
    var validate = require('../src');

    describe('atom', function () {

        it('should pass', function () {
            var issue = validate({
                type: 'string',
                multiple: false
            })('hallo');
            expect(issue).to.deep.equal({
                value: 'hallo',
                valid: true,
                error: undefined
            });
        });

        it('should fail', function () {
            var issue = validate({
                type: 'string',
                multiple: true
            })('hallo');
            expect(issue).to.deep.equal({
                value: 'hallo',
                valid: false,
                error: 'type'
            });
        });
    });

    describe('node', function () {

        it('should fail', function () {
            var issue = validate({
                type: 'string',
                multiple: false
            })(['hallo']);
            expect(issue).to.deep.equal({
                value: ['hallo'],
                valid: false,
                error: 'type'
            });
        });

        it('should pass', function () {
            var issue = validate({
                type: 'string',
                multiple: true
            })(['hallo']);
            expect(issue).to.deep.equal({
                value: ['hallo'],
                valid: true,
                error: undefined
            });
        });
    });
});