/*
 * Copyright (c) 2014 Frank Hellwig
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

var path = require('path');

/**
 * Given an initial directory, finds the package.json file and returns an
 * object having the following four properties: name (string), directory
 * (string), resolve (function), and relative (function).
 *
 * The name is the name property from the package.json file. The directory
 * is the location of the package.json file. The resolve function and the
 * relative function are similar to their path module counterparts, using
 * the directory as their first argument.
 *
 * The module parameter is optional. If it is supplied, then it must be a
 * module object. If the module parameter is not specified, then the initial
 * directory is the directory of the require.main.filename property. If the
 * module parameter is specified, then the initial directory is the directory
 * of the module's filename property.
 *
 * In both cases, if a package.json file is found in that directory, then it is
 * used. Otherwise, the parent directory is searched. The search for a
 * package.json file continues until the root directory is found.
 *
 * An exception is thrown if the package.json file is not found, cannot be
 * read, or does not have a name property.
 *
 * If the require.main.filename includes 'iisnode', then we are running on
 * Azure and we use the current working directory instead.
 */
function pkgfinder(module) {
    var initial = initialDirectory(module),
        current = initial,
        pathname,
        pkg;
    while (true) {
        pathname = path.resolve(current, 'package.json');
        try {
            pkg = require(pathname);
            break;
        } catch (err) {
            if (err.code !== 'MODULE_NOT_FOUND') {
                throw err;
            }
        }
        var parent = path.resolve(current, '..');
        if (current == parent) {
            throw new Error("Cannot find 'package.json' in '" + initial + "' nor any of its parent directories.");
        }
        current = parent;
    }
    if (!pkg.name) {
        throw new Error("Cannot find property 'name' in '" + pathname + "'.");
    }
    var retval = {
        name: pkg.name,
        version: pkg.version,
        directory: current,
        resolve: function () {
            return path.resolve.apply(path, [current].concat(Array.prototype.slice.call(arguments)));
        },
        relative: function (to) {
            return path.relative(current, to);
        }
    }
    return retval;
}

pkgfinder.iisnode = require.main.filename.match(/iisnode/i) !== null;

function initialDirectory(module) {
    if (typeof module === 'undefined') {
        if (pkgfinder.iisnode) {
            return process.cwd();
        } else {
            return path.dirname(require.main.filename);
        }
    }
    if (typeof module === 'object' && typeof module.filename === 'string') {
        return path.dirname(module.filename);
    }
    throw new Error("The parameter, if specified, must be a module object.");
}

module.exports = pkgfinder;
