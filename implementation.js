'use strict';

var callBound = require('call-bind/callBound');
var GetIntrinsic = require('get-intrinsic');
var $TypeError = require('es-errors/type');

var ArrayCreate = require('es-abstract/2023/ArrayCreate');
var clamp = require('es-abstract/2023/clamp');
var CreateDataPropertyOrThrow = require('es-abstract/2023/CreateDataPropertyOrThrow');
var Get = require('es-abstract/2023/Get');
var LengthOfArrayLike = require('es-abstract/2023/LengthOfArrayLike');
var ToIntegerOrInfinity = require('es-abstract/2023/ToIntegerOrInfinity');
var ToObject = require('es-object-atoms/ToObject');
var ToString = require('es-abstract/2023/ToString');

var forEach = require('es-abstract/helpers/forEach');
var $MAX_SAFE_INTEGER = require('es-abstract/helpers/maxSafeInteger');

var max = GetIntrinsic('%Math.max%');
var min = GetIntrinsic('%Math.min%');

var $slice = callBound('Array.prototype.slice');

// eslint-disable-next-line max-statements, max-lines-per-function
module.exports = function toSpliced(start, deleteCount) {
	var O = ToObject(this); // step 1
	var len = LengthOfArrayLike(O); // step 2
	var relativeStart = ToIntegerOrInfinity(start); // step 3
	var actualStart;
	if (relativeStart === -Infinity) {
		actualStart = 0; // step 4
	} else if (relativeStart < 0) {
		actualStart = max(len + relativeStart, 0); // step 5
	} else {
		actualStart = min(relativeStart, len); // step 6
	}

	var items = arguments.length > 2 ? $slice(arguments, 2) : [];

	var insertCount = items.length; // step 7
	var actualDeleteCount;
	if (arguments.length < 1) { // step 8
		actualDeleteCount = 0;
	} else if (arguments.length < 2) { // step 9
		actualDeleteCount = len - actualStart;
	} else { // step 10
		var dc = ToIntegerOrInfinity(deleteCount);
		actualDeleteCount = clamp(dc, 0, len - actualStart);
	}

	var newLen = len + insertCount - actualDeleteCount; // step 11

	if (newLen > $MAX_SAFE_INTEGER) {
		throw new $TypeError('Length exceeded the maximum array length');
	}
	var A = ArrayCreate(newLen); // step 13
	var i = 0; // step 14
	var r = actualStart + actualDeleteCount; // step 15
	while (i < actualStart) { // step 16
		var Pi = ToString(i);
		var iValue = Get(O, Pi);
		CreateDataPropertyOrThrow(A, Pi, iValue);
		i += 1;
	}
	/* eslint no-shadow: 1, no-redeclare: 1 */
	forEach(items, function (E) { // step 17
		var Pi = ToString(i);
		CreateDataPropertyOrThrow(A, Pi, E);
		i += 1;
	});

	while (i < newLen) { // step 18
		var Pi = ToString(i);
		var from = ToString(r);
		var fromValue = Get(O, from);
		CreateDataPropertyOrThrow(A, Pi, fromValue);
		i += 1;
		r += 1;
	}

	return A; // step 19
};
