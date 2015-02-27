'use strict';

var marked = require('marked');
var path = require('path');
var fs = require('fs');
var mustache = require('mustache');
var merge = require('merge');
var mdRenderer = require('marked-to-md');
var uriRewriteRenderer = require('./url-rewrite-renderer');
var logger = require('./logger');

module.exports = function(config, file, filesToRender) {
	logger.debug('file to compile:', file);
	var md = fs.readFileSync(file.path, 'utf-8');
	var tokens = marked.lexer(md);
	// Set page title
	var title = path.basename(file.path, path.extname(file.path));
	for (var i = 0; i < tokens.length; i ++) {
		if (tokens[i].type === 'heading') {
			title = tokens[i].text;
			break;
		}
	}

	var baseUri = (new Array(path.normalize(file.path).split(path.sep).length)).join('..' + path.sep).replace(/\\/g, '\/');
	console.log(file.path, ':', baseUri);
	logger.debug('baseUri:', baseUri);

	var documentTags = {};
	Object.keys(tokens.links).forEach(function(link) {
		if (link.indexOf('tag-') === 0) {
			documentTags[link.substr('tag-'.length)] = tokens.links[link].title;
		}
	});
	//console.log('documentTags:', documentTags);

	// For table of content: header id is (this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-'))
	//console.log('tokens:', tokens);

	// Rewrite URIs
	var uriRenderer = uriRewriteRenderer(new marked.Renderer(), baseUri, file, filesToRender);
	for (i = 0; i < tokens.length; i++) {
		if (tokens[i].text && (tokens[i].type !== 'code')) {
			tokens[i].text = marked.inlineLexer(tokens[i].text, tokens.links, {renderer: uriRenderer});
			//console.log(tokens[i].text);
		}
	}


	// Begin Markdown for slideshow
	var updatedTokens = [];
	for (i = 0; i < tokens.length; i++) {
		if ((i !== 0) && (tokens[i].type === 'heading') && (tokens[i].depth <= 3) && (tokens[i-1].type !== 'hr')) {
			updatedTokens.push({'type': 'hr'});
		}
		if (tokens[i].type === 'heading') {
			if (tokens[i].depth === 1) {
				updatedTokens.push({'type': 'paragraph', 'text': 'class: center, middle, main-title'});
			} else if (tokens[i].depth === 2) {
				if ((i === tokens.length - 1) || (tokens[i+1].type === 'heading')) {
					updatedTokens.push({'type': 'paragraph', 'text': 'class: center, middle, title'});
				}
			}
		}
		updatedTokens.push(tokens[i]);
	}
	updatedTokens.links = tokens.links;
	//console.log(updatedTokens);
	var renderer = mdRenderer(new marked.Renderer());

	var parser = new marked.Parser({renderer: renderer});
	var slideMarkdown = parser.parse(updatedTokens);
	// End Markdown for slideshow

	// HTML content
	var content = marked.parser(tokens);

	file.versions.forEach(function(version) {
		var outputFilename = path.resolve(path.join('.vegetables', 'website', version.uri));
		logger.log('Generating: ', outputFilename);

		// Render template and write it
		//console.log('version info:', version);
		fs.readFile(version.templateFile, {encoding: 'utf-8'}, function(err, templateContent) {
			//console.log('template content: ', templateContent);
			if (err) {
				logger.error('Template read error: ', err);
				return;
			}

			var tags = merge({
				// Common tags
				title: title,
				baseUri: baseUri,
				document: file.path.replace(/\\/g, '\/'),
				format: version.format,
				content: content,
				markdown: md,
				slideMarkdown: slideMarkdown,

				active: function() {
					return function(text, render) {
						return (render(text) === version.uri ? 'active' : '');
					};
				},

				activeDocument: function() {
					return function(text, render) {
						return (render(text) === file.path.replace(/\\/g, '\/') ? 'active' : '');
					};
				},

				uriByVersion: function() {
					var uri = '';
					return function(text, render) {
						file.versions.some(function(version) {
							if (version.format === 'default') {
								uri = version.uri;
							}

							if (version.format === render(text)) {
								uri = version.uri;
								return true;
							}
							return false;

						});
						if ((uri === '') && (file.versions.length !== 0)) {
							uri = file.versions[0].uri;
						}
						return uri;
					};
				},

				timestamp: (new Date()).toLocaleString(),

				currentUri: version.uri,
				//pageOptions: config.pageOptions[document] if exists or {}

				versions: file.versions

			}, config.tags, documentTags); // Configuration and in-document tags
			try {
				var rendered = mustache.render(templateContent, tags);
				fs.writeFile(outputFilename, rendered, {encoding: 'utf-8'}, function() {});
			} catch(e) {
				logger.error('Error while rendering the document "%s" from template "%s": %s', outputFilename, version.templateFile, e);
			}

		});
	});


};
