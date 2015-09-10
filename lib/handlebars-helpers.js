'use strict';

var logger = require('./logger');
var handlebars = require('handlebars');
var htmlToText = require('html-to-text');

module.exports = function() {
	logger.success('Loading handlebars helpers...');

	// Define common handlebars helpers
	handlebars.registerHelper('slugize', function(item) {
		return encodeURIComponent(item);
	});

	handlebars.registerHelper('eq', function(a, b, opts) {
		if (a == b) { // jshint ignore:line
			return opts.fn(this);
		} else {
			return opts.inverse(this);
		}
	});

	handlebars.registerHelper('neq', function(a, b, opts) {
		if (a != b) { // jshint ignore:line
			return opts.fn(this);
		} else {
			return opts.inverse(this);
		}
	});

	handlebars.registerHelper('textize', function(html) {
		return htmlToText.fromString(html);
	});

	handlebars.registerHelper('json', function(o) {
		return JSON.stringify(o);
	});
};
