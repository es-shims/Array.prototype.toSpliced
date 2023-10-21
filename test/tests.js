'use strict';

var hasOwn = require('hasown');
var mockProperty = require('mock-property');

var canDistinguishSparseFromUndefined = 0 in [undefined]; // IE 6 - 8 have a bug where this returns false.

function testSplice(t, toSpliced, input, args, expected, msg) {
	var arr = input.slice();
	arr.splice.apply(arr, args);
	t.deepEqual(arr, expected, 'sanity check: splice ' + msg);

	t.deepEqual(toSpliced.apply(null, [input].concat(args)), expected, 'toSpliced ' + msg);
}

function makeArray(l, givenPrefix) {
	var prefix = givenPrefix || '';
	var length = l;
	var arr = [];
	while (length--) { // eslint-disable-line no-plusplus
		arr.unshift(prefix + Array(length + 1).join(' ') + length);
	}
	return arr;
}

module.exports = function (toSpliced, t) {
	var b = ['b'];
	var a = [1, 'a', b];

	t.test('defaults deleteCount to length - start if there is only 1 argument', function (st) {
		testSplice(st, toSpliced, [0, 1, 2], [-Infinity], [], 'with start -Infinity');
		testSplice(st, toSpliced, [0, 1, 2], [-1], [0, 1], 'with start -1');
		testSplice(st, toSpliced, [0, 1, 2], [0], [], 'with start 0');
		testSplice(st, toSpliced, [0, 1, 2], [1], [0], 'with start 1');

		st.end();
	});

	testSplice(t, toSpliced, a, [], a, 'noop with no arguments');
	testSplice(t, toSpliced, a, [0, 0], a, '0 start and 0 deleteCount yields same array contents');
	testSplice(t, toSpliced, a, [0, 2], [b], '0 start and 2 deleteCount removes 2 items');

	t.test('multiple splices 1', function (st) {
		var first = toSpliced([], 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20);
		var second = toSpliced(first, 1, 0, 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25', 'F26');
		var third = toSpliced(second, 5, 0, 'XXX');

		st.deepEqual(
			third,
			[1, 'F1', 'F2', 'F3', 'F4', 'XXX', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25', 'F26', 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
		);

		st.end();
	});

	t.test('multiple splices 2', function (st) {
		var array = makeArray(6);

		var first = toSpliced(array, array.length - 1, 1, '');
		var second = toSpliced(first, 0, 1, 1, 2, 3, 4);
		var third = toSpliced(second, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45);

		var fourth = toSpliced(third, 4, 0, '99999999999999');

		st.deepEqual(
			fourth,
			[1, 2, 3, 4, '99999999999999', 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 1, 2, 3, 4, ' 1', '  2', '   3', '    4', '']
		);

		st.end();
	});

	t.test('multiple splices 3', function (st) {
		var array = [1, 2, 3];

		var arrA = toSpliced(array, 0, array.length);
		var arrB = toSpliced(arrA, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
		var arrC = toSpliced(arrB, 1, 1, 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25', 'F26');
		var arrD = toSpliced(arrC, 5, 1, 'YYY', 'XXX');
		var arrE = toSpliced(arrD, 0, 1);
		var arrF = toSpliced(arrE, 0, 2).slice(0, -1).concat(makeArray(10, '-'));
		var arrG = toSpliced(arrF, arrF.length - 2, 10);
		var arrH = toSpliced(arrG);
		var arrI = toSpliced(arrH, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9);
		var arrJ = toSpliced(arrI, 1, 1, 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25', 'F26', 1, 23, 4, 5, 6, 7, 8);
		var arrK = toSpliced(arrJ, 30, 10);
		var arrL = toSpliced(arrK, 30, 1);
		var arrM = toSpliced(arrL, 30, 0);
		var arrN = toSpliced(arrM, 2, 5, 1, 2, 3, 'P', 'LLL', 'CCC', 'YYY', 'XXX').concat(1, 2, 3, 4, 5, 6);
		var arrO = toSpliced(arrN, 1, 6, 1, 2, 3, 4, 5, 6, 7, 8, 9, 4, 5, 6, 7, 8, 9);
		var arrP = [7, 8, 9, 10, 11].concat(toSpliced(arrO, 3, 7)).slice(0, -1);
		var arrQ = makeArray(8, '~').concat(toSpliced(arrP, 5, 2).slice(0, -1)).slice(0, -1);
		var arrS = toSpliced(arrQ, 3, 1, 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25', 'F26', 1, 23, 4, 5, 6, 7, 8);
		var arrT = toSpliced(arrS, 4, 5, 'P', 'LLL', 'CCC', 'YYY', 'XXX');

		st.deepEqual(
			arrT,
			['~0', '~ 1', '~  2', 'F1', 'P', 'LLL', 'CCC', 'YYY', 'XXX', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25', 'F26', 1, 23, 4, 5, 6, 7, 8, '~    4', '~     5', '~      6', '~       7', 7, 8, 9, 10, 11, 2, 4, 5, 6, 7, 8, 9, 'CCC', 'YYY', 'XXX', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25', 'F26', 1, 23, 4, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'YYY', 'XXX', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25', 'F26', 3, 4, 5, 6, 7, 8, 9, '-0', '- 1', '-  2', '-   3', '-    4', '-     5', '-      6', '-       7', 1, 2, 3]
		);

		st.end();
	});

	t.deepEqual(
		toSpliced(a, void undefined, 2),
		toSpliced(a, 0, 2),
		'should set first argument to 0 if first argument is set but undefined'
	);

	t.test('objects', function (st) {
		st.deepEqual(
			toSpliced({}, 0, 0, 1, 2, 3),
			[1, 2, 3],
			'empty object'
		);

		st.deepEqual(
			toSpliced({ 0: 1, length: 1 }, 1, 0, 2, 3),
			[1, 2, 3],
			'arraylike object of length 1'
		);

		st.deepEqual(
			toSpliced({ 0: 1, 1: 2, 2: 3, length: 3 }, 0, 3),
			[],
			'arraylike object of length 3, deleteCount 3'
		);

		st.deepEqual(
			toSpliced({ 0: 99, length: 1 }, 0, 1, 1, 2, 3),
			[1, 2, 3],
			'arraylike object, replacing items'
		);

		st.end();
	});

	t.test('can distinguish sparse from undefined', { skip: !canDistinguishSparseFromUndefined }, function (st) {
		// test from https://github.com/wikimedia/VisualEditor/blob/d468b00311e69c2095b9da360c5745153342a5c3/src/ve.utils.js#L182-L196
		var n = 256;
		var arr = [];
		arr[n] = 'a';
		var result = toSpliced(arr, n + 1, 0, 'b');
		st.equal(result[n], 'a');

		// test from https://github.com/wikimedia/VisualEditor/blob/d468b00311e69c2095b9da360c5745153342a5c3/src/ve.utils.js#L182-L196
		var original = Array(1e5 - 1);
		original[10] = 'x';
		var tooBig = Array(1e5);
		tooBig[8] = 'x';

		var copied = toSpliced(original, 1, 1);
		original.splice(1, 1);

		st.equal(8 in original, false, 'splice leaves holes');
		st.equal(8 in copied, true, 'toSpliced does not leave holes');

		st.equal(original.indexOf('x'), 9);
		st.equal(copied.indexOf('x'), 9);

		var tooBigCopy = toSpliced(tooBig, 1, 1);
		tooBig.splice(1, 1);

		st.equal(6 in tooBig, false, 'splice leaves holes');
		st.equal(6 in tooBigCopy, true, 'toSpliced does not leave holes');

		st.equal(tooBig.indexOf('x'), 7);
		st.equal(tooBigCopy.indexOf('x'), 7);

		st.end();
	});

	t.deepEqual(toSpliced({ length: '2', 0: 0, 1: 1, 2: 2 }, 0, 0), [0, 1]);

	var arrayLikeLengthValueOf = {
		length: {
			valueOf: function () { return 2; }
		},
		0: 0,
		1: 1,
		2: 2
	};
	t.deepEqual(toSpliced(arrayLikeLengthValueOf, 0, 0), [0, 1]);

	t.test('not positive integer lengths', function (st) {
		st.deepEqual(toSpliced({ length: -2 }), []);
		st.deepEqual(toSpliced({ length: 'dog' }), []);
		st.deepEqual(toSpliced({ length: NaN }), []);

		st.end();
	});

	t.deepEqual(toSpliced(['first', 'second', 'third'], 1), ['first']);
	t.deepEqual(toSpliced(['first', 'second', 'third']), ['first', 'second', 'third']);
	t.deepEqual(toSpliced(['first', 'second', 'third'], 1, undefined), ['first', 'second', 'third']);
	t.deepEqual(toSpliced(['first', 'second', 'third'], undefined, undefined), ['first', 'second', 'third']);

	t.deepEqual(
		toSpliced([0, 1, 2, 3, 4], 10, 1, 5, 6),
		[0, 1, 2, 3, 4, 5, 6],
		'start-bigger-than-length'
	);
	t.deepEqual(
		toSpliced([0, 1, 2, 3, 4], -Infinity, 2),
		[2, 3, 4],
		'start-neg-infinity-is-zero'
	);
	t.deepEqual(
		toSpliced([0, 1, 2, 3, 4], -20, 2),
		[2, 3, 4],
		'start-neg-less-than-minus-length-is-zero'
	);
	t.deepEqual(
		toSpliced([0, 1, 2, 3, 4], -3, 2),
		[0, 1, 4],
		'start-neg-subtracted-from-length'
	);

	t.test('too-large lengths', function (st) {
		var arrayLike = {
			9007199254740989: Math.pow(2, 53) - 3,
			9007199254740990: Math.pow(2, 53) - 2,
			9007199254740991: Math.pow(2, 53) - 1,
			9007199254740992: Math.pow(2, 53),
			9007199254740994: Math.pow(2, 53) + 2, // NOTE: 2 ** 53 + 1 is 2 ** 53
			length: Math.pow(2, 53) + 20
		};

		var result = toSpliced(arrayLike, 0, Math.pow(2, 53) - 3);
		st.equal(result.length, 2);
		st.deepEqual(result, [Math.pow(2, 53) - 3, Math.pow(2, 53) - 2]);

		var arrayLike2 = {
			0: 0,
			4294967295: 4294967295,
			4294967296: 4294967296,
			length: Math.pow(2, 32)
		};
		st['throws'](
			function () { toSpliced(arrayLike2, 0, 0); },
			RangeError
		);

		arrayLike2.length = Math.pow(2, 32) - 1;
		st['throws'](
			function () { toSpliced(arrayLike2, 0, 0, 1); },
			RangeError
		);

		arrayLike2.length = Math.pow(2, 32);
		st['throws'](
			function () { toSpliced(arrayLike2, 0, 0, 1); },
			RangeError
		);

		arrayLike2.length = Math.pow(2, 32) + 1;
		st['throws'](
			function () { toSpliced(arrayLike2, 0, 0, 1); },
			RangeError
		);

		arrayLike2.length = Math.pow(2, 52) - 2;
		st['throws'](
			function () { toSpliced(arrayLike2, 0, 0, 1); },
			RangeError
		);

		arrayLike2.length = Math.pow(2, 53) - 1;
		st['throws'](
			function () { toSpliced(arrayLike2, 0, 0, 1); },
			TypeError
		);

		arrayLike2.length = Math.pow(2, 53);
		st['throws'](
			function () { toSpliced(arrayLike2, 0, 0, 1); },
			TypeError
		);

		arrayLike2.length = Math.pow(2, 53) + 1;
		st['throws'](
			function () { toSpliced(arrayLike2, 0, 0, 1); },
			TypeError
		);

		st['throws'](
			function () { toSpliced({ length: Math.pow(2, 53) - 1 }, 0, 0, 1); },
			TypeError,
			'throws the proper kind of error for >= 2**53'
		);

		st['throws'](
			function () { toSpliced({ length: Math.pow(2, 32) - 1 }, 0, 0, 1); },
			RangeError,
			'throws the proper kind of error for [2**32, 2**53]'
		);

		st.end();
	});

	t.deepEqual(toSpliced(true), [], 'true yields empty array');
	t.deepEqual(toSpliced(false), [], 'false yields empty array');

	t.test('deleteCount-clamped-between-zero-and-remaining-count', function (st) {
		st.deepEqual(
			toSpliced([0, 1, 2, 3, 4, 5], 2, -1),
			[0, 1, 2, 3, 4, 5]
		);

		st.deepEqual(
			toSpliced([0, 1, 2, 3, 4, 5], -4, -1),
			[0, 1, 2, 3, 4, 5]
		);

		st.deepEqual(
			toSpliced([0, 1, 2, 3, 4, 5], 2, 6),
			[0, 1]
		);

		st.deepEqual(
			toSpliced([0, 1, 2, 3, 4, 5], -4, 6),
			[0, 1]
		);

		st.end();
	});

	t.test('getters', { skip: !Object.defineProperty }, function (st) {
		var arrayLike = {
			0: 'a',
			1: 'b',
			2: null,
			3: 'c',
			length: 4
		};
		Object.defineProperty(arrayLike, 2, {
			get: function () { throw new SyntaxError(); }
		});
		st.deepEqual(
			toSpliced(arrayLike, 2, 1),
			['a', 'b', 'c'],
			'index 2 is not invoked'
		);

		var order = [];
		var arrayLike2 = {
			0: 'a',
			1: 'b',
			2: 'none',
			3: 'c',
			length: 4
		};
		Object.defineProperty(arrayLike2, 0, {
			get: function () {
				order.push(0);
				return 'a';
			}
		});
		Object.defineProperty(arrayLike2, 1, {
			get: function () {
				order.push(1);
				return 'b';
			}
		});
		Object.defineProperty(arrayLike2, 3, {
			get: function () {
				order.push(3);
				return 'c';
			}
		});

		st.deepEqual(
			toSpliced(arrayLike2, 2, 1),
			['a', 'b', 'c'],
			'splicing works as expected'
		);
		st.deepEqual(
			order,
			[0, 1, 3],
			'indexes are Get-ed in expected order'
		);

		st.test('length-decreased-while-iterating', function (s2t) {
			var arr = [0, 1, 2, 3, 4, 5];
			s2t.teardown(mockProperty(Array.prototype, 3, { value: 6 }));
			Object.defineProperty(arr, '2', {
				get: function () {
					arr.length = 1;
					return 2;
				}
			});

			s2t.deepEqual(toSpliced(arr, 0, 0), [0, 1, 2, 6, undefined, undefined]);

			s2t.end();
		});

		st.test('length-increased-while-iterating', function (s2t) {
			var arr = [0, 1, 2];
			Object.defineProperty(arr, '0', {
				get: function () {
					arr.push(10);
					return 0;
				}
			});
			Object.defineProperty(arr, '2', {
				get: function () {
					arr.push(11);
					return 2;
				}
			});

			s2t.deepEqual(toSpliced(arr, 1, 0, 0.5), [0, 0.5, 1, 2]);

			s2t.end();
		});

		st.test('mutate-while-iterating', function (s2t) {
			var arr = [0, 1, 2, 3];
			var zerothElementStorage = arr[0];
			Object.defineProperty(arr, '0', {
				get: function () {
					arr[1] = 42;
					return zerothElementStorage;
				},
				set: function (v) {
					zerothElementStorage = v;
				}
			});
			Object.defineProperty(arr, '2', {
				get: function () {
					arr[0] = 17;
					arr[3] = 37;
					return 2;
				}
			});
			s2t.deepEqual(
				toSpliced(arr, 1, 0, 0.5),
				[0, 0.5, 42, 2, 37]
			);

			s2t.end();
		});

		st.end();
	});

	t.test('holes', function (st) {
		var arr = [0, /* hole */, 2, /* hole */, 4]; // eslint-disable-line no-sparse-arrays
		st.teardown(mockProperty(Array.prototype, 3, { value: 3 }));

		var spliced = toSpliced(arr, 0, 0);
		st.deepEqual(spliced, [0, undefined, 2, 3, 4]);
		st.ok(hasOwn(spliced, 1));
		st.ok(hasOwn(spliced, 3));

		st.deepEqual(
			toSpliced(arr, 0, 0, -1),
			[-1, 0, undefined, 2, 3, 4]
		);

		st.end();
	});
};
