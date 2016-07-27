'use strict';

var _ = require('lodash'),
    type = require('../type'),
    turn = require('../turn');

/**
 * Escapes regular expression chars
 * @param {string} pattern
 * @returns {string}
 * @see http://kevin.vanzonneveld.net
 * @original booeyOH
 * @improved Ates Goral (http://magnetiq.com)
 * @improved Kevin van Zonneveld (http://kevin.vanzonneveld.net)
 * @bugfixed Onno Marsman
 * @improved Brett Zamir (http://brett-zamir.me)
 * @example escape("$40"); ==> '\$40'
 * @example escape("*RRRING* Hello?"); ==> '\*RRRING\* Hello\?'
 * @example escape("\\.+*?[^]$(){}=!<>|:"); ==> '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'
 */
function escape(pattern) {
    var regexp = /[#.\\+*?\[\]^$(){}=!<>|:\/-]/g;
    return String(pattern).replace(regexp, '\\$&');
}

/**
 * Convert glob to regular expression
 * @param {string} pattern
 * @return {RegExp}
 */
function glob2regx(pattern) {
    pattern = escape(pattern);
    pattern = _.reduce({
        '*': '.*',
        '?': '.',
        '#': '[0-9]'
    }, function (pattern, regex, glob) {
        return pattern.split(glob).map(function (part, index, parts) {
            var match, escaped, pattern;
            if (!part || index + 1 === parts.length) {
                return part;
            }
            match = part.match(/^(.*?)(\\*)$/);
            escaped = Math.round(match[2].length / 2) % 2 === 0;
            pattern = escaped ? glob : regex;
            return match[1] + '\\'.repeat(Math.floor(match[2].length / 2)) + pattern;
        }).join('');
    }, pattern);
    return new RegExp('^' + pattern + '$');
}

/**
 * Create fsm for number type
 * @param {Object} props
 * @param {boolean} [props.required]
 * @param {string|string[]} [props.mime]
 * @param {number} [props.minLength]
 * @param {number} [props.minLengthInclusive]
 * @param {number} [props.minLengthExclusive]
 * @param {number} [props.maxLength]
 * @param {number} [props.maxLengthInclusive]
 * @param {number} [props.maxLengthExclusive]
 * @returns {FSM}
 */
module.exports = function (props) {
    return type({
        type: 'map',
        required: props.required,
        node: {
            path: {
                type: 'string',
                required: true,
                trim: true,
                minLength: 1
            },
            name: {
                type: 'string',
                required: true,
                trim: true,
                minLength: 1
            },
            mime: {
                type: 'string',
                required: true,
                trim: true,
                pattern: _.isUndefined(props.mime) ? props.mime : turn.array(props.mime).map(glob2regx)
            },
            size: {
                type: 'number',
                required: true,
                truth: 0,
                step: 1,
                min: props.minLength,
                minInclusive: props.minLengthInclusive,
                minExclusive: props.minLengthExclusive,
                max: props.maxLength,
                maxInclusive: props.maxLengthInclusive,
                maxExclusive: props.maxLengthExclusive
            }
        }
    });
};