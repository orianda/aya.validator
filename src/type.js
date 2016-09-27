'use strict';

var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    multiple = require('./type.util/multiple'),
    negate = require('./type.util/negate');

/**
 * Create type fsm
 * @param {Object} props
 * @returns {FSM}
 * @todo write test for multiple
 */
module.exports = function validator(props) {
    try {
        let name = props.type || 'any',
            fsm = validator.types[name](props);
        fsm.name = name;
        fsm = props.multiple ? multiple(fsm) : fsm;
        fsm = props.negate ? negate(fsm) : fsm;
        return fsm;
    } catch (error) {
        throw {
            message: 'Unknown type',
            type: props.type,
            props: props
        };
    }
};

/**
 * Load validator modules
 */
['type'].forEach(function (base) {
    base = path.join(__dirname, base);
    module.exports.types = _.chain(fs.readdirSync(base))
        .mapKeys(file => file.replace(/^(.+?)(\.js)?$/i, '$1'))
        .mapValues(file => path.join(base, file))
        .mapValues(require)
        .value();
});
