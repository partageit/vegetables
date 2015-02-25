'use strict';

var path = require('path');
var logger = require('./logger');

module.exports = function (renderer, baseUri, file, filesToRender) {
	var unescape = function(text) {
		return text
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, '\'');
	};

	// span level renderer
	renderer.strong = function(text) {
		return '**' + text + '**';
	};
	renderer.em = function(text) {
		return '*' + text + '*';
	};
	renderer.codespan = function(text) {
		return '`' + unescape(text) + '`';
	};
	renderer.br = function() {
		return '  \n';
	};
	renderer.del = function(text) {
		return '~~' + text + '~~';
	};
	renderer.link = function(href, title, text) {
		var uri = href;
		var originalDocument = path.join(path.dirname(file.path), path.dirname(href), path.basename(href));
		// get version
		if (filesToRender[originalDocument]) {
			filesToRender[originalDocument].versions.some(function(version) {
				if (version.format === 'default') {
					uri = version.uri;
					return true;
				}
				return false;

			});
			if ((uri === '') && (filesToRender[originalDocument].versions.length !== 0)) {
				uri = filesToRender[originalDocument].versions[0].uri;
			}
			// add baseUri
			if (uri !== '') {
				uri = path.join(baseUri, uri).replace(/\\/g, '\/');
				logger.debug('URI rewritten from "%s" to "%s"', href, uri);
			}
		}
		return '[' + text + '](' + uri + (title ? ' "' + title + '"' : '') + ')';
	};
	renderer.image = function(href, title, text) {
		return '![' + text + '](' + href + (title ? ' "' + title + '"' : '') + ')';
	};

	return renderer;
};
