/**
 * Copyright © 2015,2016 STRG.AT GmbH, Vienna, Austria
 *
 * This file is part of the The SCORE Framework.
 *
 * The SCORE Framework and all its parts are free software: you can redistribute
 * them and/or modify them under the terms of the GNU Lesser General Public
 * License version 3 as published by the Free Software Foundation which is in the
 * file named COPYING.LESSER.txt.
 *
 * The SCORE Framework and all its parts are distributed without any WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE. For more details see the GNU Lesser General Public
 * License.
 *
 * If you have not received a copy of the GNU Lesser General Public License see
 * http://www.gnu.org/licenses/.
 *
 * The License-Agreement realised between you as Licensee and STRG.AT GmbH as
 * Licenser including the issue of its valid conclusion and its pre- and
 * post-contractual effects is governed by the laws of Austria. Any disputes
 * concerning this License-Agreement including the issue of its valid conclusion
 * and its pre- and post-contractual effects are exclusively decided by the
 * competent court, in whose district STRG.AT GmbH has its registered seat, at
 * the discretion of STRG.AT GmbH also the competent court, in whose district the
 * Licensee has his registered seat, an establishment or assets.
 */

// Universal Module Loader
// https://github.com/umdjs/umd
// https://github.com/umdjs/umd/blob/v1.0.0/returnExports.js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        var old = root.score, score = factory();
        score.noConflict = function() {
            root.score = old;
            // setting old to something else to allow it to be
            // garbage-collected (we don't need it any more)
            old = score;
            score.noConflict = function() {
                return score;
            };
            return score;
        };
        root.score = score;
    }
})(this, function() {

    var __queue = [], score = {

        __version__: '0.0.3',

        extend: function(fullName, dependencies, callback) {
            var i, j, tmp, nextName, parts, currentPart, nextPart, missing = [];
            for (i = 0; i < dependencies.length; i++) {
                parts = dependencies[i].split('.');
                currentPart = score;
                for (j = 0; j < parts.length; j++) {
                    try {
                        nextPart = currentPart[parts[j]];
                    } catch(e) {
                        missing.push(parts.slice(0, j + 1).join('.'));
                        break;
                    }
                    if (!nextPart) {
                        missing.push(parts.slice(0, j + 1).join('.'));
                        break;
                    }
                    currentPart = nextPart;
                }
            }
            currentPart = score;
            parts = fullName.split('.');
            for (j = 0; j < parts.length - 1; j++) {
                try {
                    nextPart = currentPart[parts[j]];
                } catch(e) {
                    missing.push(parts.slice(0, j + 1).join('.'));
                    break;
                }
                if (!nextPart) {
                    missing.push(parts.slice(0, j + 1).join('.'));
                    break;
                }
                currentPart = nextPart;
            }
            nextName = parts[j];
            if (missing.length) {
                __queue.push([fullName, dependencies, callback]);
                tmp = {};
                tmp[nextName] = {
                    configurable: true,
                    get: function() {
                        throw new Error('Missing ' + fullName + ' dependencies: [' + missing.join(', ') + ']');
                    },
                    set: function(value) {
                        tmp[nextName] = {value: value, enumerable: true};
                        Object.defineProperties(currentPart, tmp);
                    }
                };
                Object.defineProperties(currentPart, tmp);
            } else {
                currentPart[nextName] = callback.call(score, score);
                tmp = __queue;
                __queue = [];
                for (i = 0; i < tmp.length; i++) {
                    score.extend.apply(this, tmp[i]);
                }
            }
        }

    };

    return score;

});
