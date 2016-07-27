'use strict';

var _ = require('lodash'),
    chai = require('chai'),
    expect = chai.expect;

chai.use(require('chai-as-promised'));

describe('set', function () {
    var validate = require('../src');

    it('should', function () {
        var issue = validate({
            type: 'set',
            node: [
                {
                    type: 'string'
                }
            ]
        })(['hallo']);
        expect(issue).to.deep.equal({
            value: ['hallo'],
            valid: true,
            error: undefined
        });
    });

    it('should', function () {
        var issue = validate({
            type: 'set',
            node: [
                {
                    type: 'number'
                }
            ]
        })(['hallo']);
        expect(issue).to.deep.equal({
            value: [NaN],
            valid: false,
            error: {0: 'type'}
        });
    });

    it('should', function () {
        var issue = validate({
            type: 'set',
            node: [
                {
                    type: 'string'
                }
            ]
        })(['hallo', 'eumel']);
        expect(issue).to.deep.equal({
            value: ['hallo', 'eumel'],
            valid: true,
            error: undefined
        });
    });

    it('should', function () {
        var issue = validate({
            type: 'set',
            node: [
                {
                    type: 'string'
                }
            ]
        })(['hallo', 12]);
        expect(issue).to.deep.equal({
            value: ['hallo', '12'],
            valid: true,
            error: undefined
        });
    });

    it('should', function () {
        var issue = validate({
            type: 'set',
            node: [
                {
                    type: 'number'
                }
            ]
        })(['hallo', 12]);
        expect(issue).to.deep.equal({
            value: [NaN, 12],
            valid: false,
            error: {0: 'type'}
        });
    });

    it('should', function () {
        var issue = validate({
            type: 'set',
            node: [
                {
                    type: 'number'
                },
                {
                    type: 'string'
                }
            ]
        })(['hallo', 12]);
        expect(issue).to.deep.equal({
            value: ['hallo', 12],
            valid: true,
            error: undefined
        });
    });

    it('should', function () {
        var issue = validate({
            type: 'set',
            node: [
                {
                    type: 'number'
                },
                {
                    type: 'string'
                },
                {
                    type: 'boolean',
                    strict: true
                }
            ]
        })(['hallo', 12]);
        expect(issue).to.deep.equal({
            value: ['hallo', 12],
            valid: true,
            error: undefined
        });
    });

    it('should', function () {
        var issue = validate({
            type: 'set',
            node: [
                {
                    type: 'number'
                },
                {
                    type: 'string'
                },
                {
                    type: 'boolean',
                    required: true,
                    strict: true
                }
            ]
        })(['hallo', 12]);
        expect(issue).to.deep.equal({
            value: ['hallo', 12],
            valid: false,
            error: {2: 'required'}
        });
    });

    it('should', function () {
        var issue = validate({
            type: 'set',
            node: [
                {}
            ]
        })([]);
        expect(issue).to.deep.equal({
            value: [],
            valid: true,
            error: undefined
        });
    });

    it('should', function () {
        var issue = validate({
            type: 'set',
            node: []
        })([]);
        expect(issue).to.deep.equal({
            value: [],
            valid: true,
            error: undefined
        });
    });

    it('should', function () {
        var issue = validate({
            type: 'set',
            node: []
        })(['hallo']);
        expect(issue).to.deep.equal({
            value: ['hallo'],
            valid: false,
            error: {0: 'unknown'},
            occur: {0: 'maxOccur'}
        });
    });

    it('should', function () {
        var issue = validate({
            type: 'set',
            node: [
                {
                    type: 'string'
                },
                {
                    type: 'number',
                    minOccur: 1
                }
            ]
        })(['hallo', 12]);
        expect(issue).to.deep.equal({
            value: ['hallo', 12],
            valid: true,
            error: undefined
        });
    });

    it('should', function () {
        var issue = validate({
            type: 'set',
            node: [
                {
                    type: 'string',
                    maxOccur: 1
                },
                {
                    type: 'number'
                }
            ]
        })(['hallo', 12]);
        expect(issue).to.deep.equal({
            value: ['hallo', 12],
            valid: true,
            error: undefined
        });
    });

    it('should', function () {
        var issue = validate({
            type: 'set',
            node: [
                {
                    type: 'string',
                    maxOccur: 1
                },
                {
                    type: 'number'
                }
            ]
        })(['hallo', 12, '77']);
        expect(issue).to.deep.equal({
            value: ['hallo', 12, 77],
            valid: true,
            error: undefined
        });
    });

    it('should', function () {
        var issue = validate({
            type: 'set',
            node: [
                {
                    type: 'string',
                    maxOccur: 1
                },
                {
                    type: 'number'
                }
            ]
        })(['hallo', 12, 'eumel']);
        expect(issue).to.deep.equal({
            value: ['hallo', 12, 'eumel'],
            valid: false,
            error: undefined,
            occur: {
                0: 'maxOccur'
            }
        });
    });
});