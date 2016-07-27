'use strict';

/**
 * Convert decimal to binary
 * @param {number} dec
 * @returns {string}
 */
function dec2bin(dec) {
    return dec.toString(2);
}

/**
 * Convert binary to decimal
 * @param {string} bin
 * @returns {Number}
 */
function bin2dec(bin) {
    return parseInt(bin, 2);
}

/**
 * Split string into chunks
 * @param {string} string
 * @param {number} length
 * @returns {string[]}
 */
function chunk(string, length) {
    var pattern = new RegExp('.{' + length + '}', 'g');
    return string.match(pattern);
}

/**
 * Padding string
 * @param {string} string
 * @param {number} length
 * @param {string} prefix
 * @returns {string}
 */
function pad(string, length, prefix) {
    length = length - string.length;
    return length > 0 ? prefix.repeat(length) + string : string;
}

/**
 * Does chunks share 1s in the same position?
 * @param {string[]} chunks
 * @returns {boolean}
 */
function avoid(chunks) {
    var sum = 0;
    return chunks.every(function (chunk) {
        var dec = bin2dec(chunk);
        sum += dec;
        return (sum & dec) === dec;
    });
}

/**
 * Null returner
 * @returns {null}
 */
function none() {
    return null;
}

/**
 * Get combination factory
 * @param {number} slotAmount
 * @param {number} itemAmount
 * @returns {Function}
 */
module.exports = function (slotAmount, itemAmount) {
    var step, stop, dec;

    slotAmount = Math.max(0, slotAmount);
    itemAmount = Math.max(0, itemAmount);
    if (!slotAmount || !itemAmount) {
        return none;
    }

    step = bin2dec('1'.repeat(itemAmount));
    stop = bin2dec('1'.repeat(itemAmount) + '0'.repeat(slotAmount * itemAmount - itemAmount));
    dec = step;

    /**
     * Get next combination
     * @returns {number[][]|null}
     */
    return function next() {
        var bin, chunks;

        if (stop < dec) {
            return null;
        }

        bin = dec2bin(dec);
        bin = pad(bin, slotAmount * itemAmount, '0');
        bin = bin.split('').reverse().join('');
        dec += step;
        chunks = chunk(bin, itemAmount);

        if (!avoid(chunks)) {
            return next();
        }

        return chunks.map(chunk => chunk.match(/./g).map(bit => parseInt(bit, 10)));
    };
};