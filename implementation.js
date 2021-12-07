'use strict';

var callBound = require('call-bind/callBound');
var GetIntrinsic = require('get-intrinsic');

var ArrayCreate = require('es-abstract/2021/ArrayCreate');
var clamp = require('es-abstract/2021/clamp');
var CreateDataPropertyOrThrow = require('es-abstract/2021/CreateDataPropertyOrThrow');
var Get = require('es-abstract/2021/Get');
var LengthOfArrayLike = require('es-abstract/2021/LengthOfArrayLike');
var ToIntegerOrInfinity = require('es-abstract/2021/ToIntegerOrInfinity');
var ToObject = require('es-abstract/2021/ToObject');
var ToString = require('es-abstract/2021/ToString');

var forEach = require('es-abstract/helpers/forEach');

var max = GetIntrinsic('%Math.max%');
var min = GetIntrinsic('%Math.min%');

var $slice = callBound('Array.prototype.slice');

// eslint-disable-next-line max-statements
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

	var A = ArrayCreate(newLen); // step 12
	var k = 0; // step 13
	while (k < actualStart) { // step 14
		var Pk = ToString(k);
		var kValue = Get(O, Pk);
		CreateDataPropertyOrThrow(A, Pk, kValue);
		k += 1;
	}
	/* eslint no-shadow: 1, no-redeclare: 1 */
	forEach(items, function (E) { // step 15
		var Pk = ToString(k);
		CreateDataPropertyOrThrow(A, Pk, E);
		k += 1;
	});

	while (k < newLen) { // step 16
		var Pk = ToString(k);
		var from = ToString(k + actualDeleteCount - insertCount);
		var fromValue = Get(O, from);
		CreateDataPropertyOrThrow(A, Pk, fromValue);
		k += 1;
	}

	return A; // step 17
};
