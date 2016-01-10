# pkgfinder

Finds the package descriptor file of a node.js application.

## Overview

Given a node.js application, finds the `package.json` file.

```javascript
var pkgfinder = require('pkgfinder'),
    pkg = pkgfinder();
```

The returned `pkg` object has the following five properties:

- `name`: {string} the name property from the `package.json` file
- `version`: {string} the version property from the `package.json` file
- `directory`: {string} the application directory containing the `package.json` file
- `resolve`: {function} resolves the specified argument against the application directory
- `relative`: {function} returns the relative path of the argument with respect to the application directory

## Details

Calling `require('pkgfinder')` returns a single `pkgfinder` function.

```javascript
pkgfinder([module])
```

Given an initial directory, the `pkgfinder` function finds the `package.json`
file and returns an object having the following four properties: name (string),
directory (string), resolve (function), and relative (function).

The `name` is the `name` property from the `package.json` file. The `directory`
is the location of the `package.json` file. The `resolve` function and the
`relative ` function are similar to their  `path` module counterparts, using
the `directory` as their first argument.

The `module` parameter is optional. If it is supplied, then it must be a module
object. If the `module` parameter is not specified, then the initial directory
is the directory of the `require.main.filename` property. If the `module`
parameter is specified, then the initial directory is the directory of the
module's `filename` property.

A special exception to this is if `require.main` contains the string `iisnode`.
In that case, we are probably running on Microsoft Azure and use the current
working directory as the initial directory. A boolean flag indicating this is
available on the exported module function as `pkgfinder.issnode`.

In both cases, if a `package.json` file is found in that directory, then it is
used. Otherwise, the parent directory is searched. The search for a
`package.json` file continues until the root directory is found.

An exception is thrown if the `package.json` file is not found, cannot be read,
or does not have a `name` property.

## Rationale

Utility packages often care about the application in which they are used rather
than their own environment. For example, a configuration manager may look for
an `config` subdirectory in the top-level application directory. This has
nothing to do with the configuration manager's location in the `node_module`
tree and may not even have anything to do with the parent module, which could
be in a `lib` subdirectory.

## Algorithm

1. Determine the main entry point of the application from `require.main.filename`.
2. Determine the directory of this module using the `path.dirname` function.
3. Attempt to load the `package.json` file in this directory.
4. If no `package.json` file is found, seach successive parent directories.
5. Return the package name and the directory if found. Otherwise, throw an exception.

## License

(The MIT License)

Copyright (c) 2014 Frank Hellwig

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
