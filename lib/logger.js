'use strict';

var colors = require('colors/safe');
var util = require('util');
// logLevel = -1: log nothing
// logLevel = 0: error, success and info
// logLevel = 1: log
// logLevel = 2: debug

var logger = function logger() {
	var options = {
		logLevel: 0
	};
	var output = function(parameters) {
		var message = new Date().toLocaleTimeString() + ' - ';
		message += util.format.apply(console, parameters);
		return message;
	};

	this.init = function(logLevel) {
		options.logLevel = logLevel;
	};

	this.error = function() {
		if (options.logLevel >= 0) {
			console.error(colors.red(output(arguments)));
		}
	};

	this.success = function() {
		if (options.logLevel >= 0) {
			console.log(colors.green(output(arguments)));
		}
	};

	this.info = function() {
		if (options.logLevel >= 0) {
			console.log(output(arguments));
		}
	};

	this.log = function() {
		if (options.logLevel >= 1) {
			console.log(colors.yellow(output(arguments)));
		}
	};

	this.debug = function() {
		if (options.logLevel >= 2) {
			console.log(output(arguments));
		}
	};
};

logger.instance = null;

logger.getInstance = function() {
	if (this.instance === null) {
		this.instance = new logger();
	}
	return this.instance;
};

module.exports = logger.getInstance();
