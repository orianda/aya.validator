'use strict';

var _ = require('lodash'),
    chai = require('chai'),
    expect = chai.expect;

chai.use(require('chai-as-promised'));

describe('node', function () {
    var validate = require('../src');

    describe('commonly valid', function () {

        it('should pass', function () {
            var issue = validate({
                negate: false
            })('hallo');
            expect(issue).to.deep.equal({
                value: 'hallo',
                valid: true,
                error: undefined
            });
        });

        it('should fail', function () {
            var issue = validate({
                negate: true
            })('hallo');
            expect(issue).to.deep.equal({
                value: 'hallo',
                valid: false,
                error: undefined
            });
        });
    });

    describe('commonly invalid', function () {

        it('should fail', function () {
            var issue = validate({
                type: 'number',
                negate: false
            })('hallo');
            expect(issue).to.deep.equal({
                value: NaN,
                valid: false,
                error: 'type'
            });
        });

        it('should pass', function () {
            var issue = validate({
                type: 'number',
                negate: true
            })('hallo');
            expect(issue).to.deep.equal({
                value: NaN,
                valid: true,
                error: 'type'
            });
        });
    });
});