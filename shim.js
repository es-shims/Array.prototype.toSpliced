'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');

module.exports = function shim() {
	var polyfill = getPolyfill();
	define(
		Array.prototype,
		{ toSpliced: polyfill },
		{ toSpliced: function () { return Array.prototype.toSpliced !== polyfill; } }
	);
	return polyfill;
};
