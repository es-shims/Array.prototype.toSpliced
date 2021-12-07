'use strict';

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
};
