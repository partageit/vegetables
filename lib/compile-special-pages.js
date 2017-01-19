'use strict';

var path = require('path');
var fs = require('fs');
var merge = require('merge');
var templatesManager = require('./templates-manager');
var dataIndex = require('./data-index.js');
var logger = require('./logger');

module.exports = function(config, template, callback) {
	logger.debug('template to compile:', template);

	// Merge common tags ********************************************************
	var commonTags = merge(true, config.tags);

	// Autoreload tag ***********************************************************
	var autoReload = '';
	if ((config.mode === 'serve') && config.serveAutoReload) {
		autoReload = '<script src="/socket.io/socket.io.js"></script>' +
			'<script>' +
			'socket = io.connect();' +
			'socket.on(\'reload\', function() { location.reload(); });' +
			'</script>';
	}

	// Define items to generate *************************************************
	var pages = [];
	switch (template.type) {
		case 'site':
			pages = ['sitewide'];
			break;
		case 'category':
			pages = dataIndex.getCategories();
			break;
		case 'tag':
			pages = dataIndex.getTags();
			break;
	}

	// Generate Web pages *******************************************************
	var callbackCounter = pages.length;
	pages.forEach(function(item) {
		var outputFilename = template.target;
		if (template.type !== 'site') {
			// template file name is 'per-category-category.html'
			// template.target is 'category.html'
			// outputFilename is 'category-<item name>.html'
			outputFilename =
				path.basename(template.target, path.extname(template.target)) +
				'-' + item +
				path.extname(template.target);
		}

		outputFilename = path.resolve(path.join('.vegetables', 'website', outputFilename));

		logger.log('Generating: %s, item: %s', outputFilename, item);

		// Local handlebars helpers
		// For now, copied from compile.js
		var helpers = {
			'active': function() { return ''; },
			'activeDocument': function() { return ''; },
			'uriByVersion': function() { return ''; }
		};

		// Render template and write it
		var tags = merge(true, {
			// Common tags
			title: '', //title,
			baseUri: './', // for now, base URI of special pages is the root folder
			itemType: template.type,
			item: item,
			timestamp: (new Date()).toLocaleString(),
			currentUri: path.basename(outputFilename),
			pages: dataIndex.getPages(template.type, item),
			autoReload: autoReload
		}, commonTags); // Configuration and in-document tags
		try {
			var renderTemplate = templatesManager.getCompiledTemplate(template.filename);
			var rendered = renderTemplate(tags, {helpers: helpers});
			fs.writeFile(outputFilename, rendered, {encoding: 'utf-8'}, function(err) {
				if (--callbackCounter === 0) {
					callback(err);
				}
			});
		} catch(e) {
			logger.error('Error while rendering the document "%s" from template "%s": %s', outputFilename, template.filename, e);
			--callbackCounter;
		}

	});

};
