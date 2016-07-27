'use strict';

var _ = require('lodash'),
    file = require('./file');

/**
 * Create fsm for number type
 * @param {Object} props
 * @param {string|string[]} [props.mime]
 * @returns {FSM}
 */
module.exports = function (props) {
    if (props.mime) {
        props = _.extend({}, props);
        props.mime = _.filter(props.mime, function (mime) {
            return (/^image\//i).test(mime);
        });
    } else {
        props.mime = 'image/*';
    }
    return file(props);
};