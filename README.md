# array.prototype.tospliced <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

An ESnext spec-compliant `Array.prototype.toSpliced` shim/polyfill/replacement that works as far down as ES3.

This package implements the [es-shim API](https://github.com/es-shims/api) interface. It works in an ES3-supported environment and complies with the proposed [spec](https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toSpliced).

Because `Array.prototype.toSpliced` depends on a receiver (the `this` value), the main export takes the array to operate on as the first argument.

## Getting started

```sh
npm install --save array.prototype.tospliced
```

## Usage/Examples

```js
var toSpliced = require('array.prototype.tospliced');
var assert = require('assert');

var input = [5, 4, 3, 2, 1, 0];

var output = toSpliced(input, 2, 2);

assert.notEqual(output, input);
assert.deepEqual(output, [5, 4, 1, 0]);
assert.deepEqual(input, [5, 4, 3, 2, 1, 0]);
```

```js
var toSpliced = require('array.prototype.tospliced');
var assert = require('assert');
/* when Array#toSpliced is not present */
delete Array.prototype.toSpliced;
var shimmed = toSpliced.shim();

assert.equal(shimmed, toSpliced.getPolyfill());
assert.deepEqual(input.toSpliced(), toSpliced(input));
```

```js
var toSpliced = require('array.prototype.tospliced');
var assert = require('assert');
/* when Array#toSpliced is present */
var shimmed = toSpliced.shim();

assert.equal(shimmed, Array.prototype.toSpliced);
assert.deepEqual(input.toSpliced(), toSpliced(input));
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[package-url]: https://npmjs.org/package/array.prototype.tospliced
[npm-version-svg]: https://versionbadg.es/es-shims/Array.prototype.toSpliced.svg
[deps-svg]: https://david-dm.org/es-shims/Array.prototype.toSpliced.svg
[deps-url]: https://david-dm.org/es-shims/Array.prototype.toSpliced
[dev-deps-svg]: https://david-dm.org/es-shims/Array.prototype.toSpliced/dev-status.svg
[dev-deps-url]: https://david-dm.org/es-shims/Array.prototype.toSpliced#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/array.prototype.tospliced.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/array.prototype.tospliced.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/array.prototype.tospliced.svg
[downloads-url]: https://npm-stat.com/charts.html?package=array.prototype.tospliced
