'use strict';

var colors = require('colors');
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
			logger.debug(colors.green(output(arguments)));
		}
	};

	this.info = function() {
		if (options.logLevel >= 0) {
			logger.debug(output(arguments));
		}
	};

	this.log = function() {
		if (options.logLevel >= 1) {
			logger.debug(colors.yellow(output(arguments)));
		}
	};

	this.debug = function() {
		if (options.logLevel >= 2) {
			logger.debug(output(arguments));
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

logger.debug = function(s) {
//	console.log(s)
}

module.exports = logger.getInstance();
