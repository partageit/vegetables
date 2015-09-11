'use strict';

//var logger = require('./logger');
var handlebars = require('handlebars');
//var htmlToText = require('html-to-text');
var truncatise = require('truncatise');

module.exports = function() {
	//logger.success('Loading handlebars helpers...');

	// Make string URI compatible, thanks to encodeURIComponent *****************
	handlebars.registerHelper('slugize', function(item) {
		return encodeURIComponent(item);
	});

	// Change HTML content to text, thanks to html-to-text **********************
	handlebars.registerHelper('textize', function(html) {
		//return htmlToText.fromString(html);
		return html.replace(/(<([^>]+)>)/ig, '');
	});

	// Truncate text content to provided size ***********************************
	handlebars.registerHelper('truncate', function(text, words) {
		//return text.substr(0, size);
		return truncatise(text, {
			TruncateLength: words,
			TruncateBy : 'words',
			Strict : true,
			StripHTML : true,
			Suffix : '...'
		});
	});

	// Change a JavaScript variable as JSON *************************************
	handlebars.registerHelper('json', function(o) {
		return JSON.stringify(o);
	});

	// A == B, works like {{if}}, i.e. it is compatible with else ***************
	handlebars.registerHelper('eq', function(a, b, opts) {
		if (a == b) { // jshint ignore:line
			return opts.fn(this);
		} else {
			return opts.inverse(this);
		}
	});

	// A != B, works like {{if}}, i.e. it is compatible with else ***************
	handlebars.registerHelper('neq', function(a, b, opts) {
		if (a != b) { // jshint ignore:line
			return opts.fn(this);
		} else {
			return opts.inverse(this);
		}
	});

	// A < B, works like {{if}}, i.e. it is compatible with else ****************
	handlebars.registerHelper('lt', function(a, b, opts) {
		if (a < b) {
			return opts.fn(this);
		} else {
			return opts.inverse(this);
		}
	});

	// A > B, works like {{if}}, i.e. it is compatible with else ****************
	handlebars.registerHelper('gt', function(a, b, opts) {
		if (a > b) {
			return opts.fn(this);
		} else {
			return opts.inverse(this);
		}
	});

};
