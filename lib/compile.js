'use strict';

var marked = require('marked');
var path = require('path');
var fs = require('fs');
var mustache = require('mustache');
var merge = require('merge');
var mdRenderer = require('./md-renderer');

//module.exports = function(config, filename, dest /*, argv*/) {
module.exports = function(config, file /*, filesToRender*/) {
	//console.log('file to compile:', file);
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

	// For table of content: header id is (this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-'))
	//console.log('tokens:', tokens);

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

	//var files = fs.readdirSync(config.template);
	file.versions.forEach(function(version) {
		var outputFilename = path.resolve(path.join('.vegetables', version.uri));
		console.log('Generating: ', outputFilename);

		// Render template and write it
		//console.log('version info:', version);
		fs.readFile(version.templateFile, {encoding: 'utf-8'}, function(err, templateContent) {
			//console.log('template content: ', templateContent);
			if (err) {
				console.log('template read error: ', err);
				return;
			}
			var rendered = mustache.render(templateContent, merge({
				title: title,
				baseUri: '/',
				document: file.path.replace('\\', '/'),
				template: version.template,
				content: content,
				markdown: md,
				slideMarkdown: slideMarkdown,

				active: function() {
					return function(text, render) {
						return (render(text) === version.uri ? 'active' : '');
					};
				},
				//activeDocument
				uriByVersion: function() {
					var uri = '';
					return function(text, render) {
						file.versions.some(function(version) {
							if (version.template === 'default') {
								uri = version.uri;
							}

							if (version.template === render(text)) {
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

				currentUri: version.uri,
				//pageOptions: config.pageOptions[document] if exists or {}

				versions: file.versions

			}, config.tags));

			fs.writeFile(outputFilename, rendered, {encoding: 'utf-8'}, function() {});

		});
	});


};
