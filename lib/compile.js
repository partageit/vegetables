'use strict';

var marked = require('marked');
var path = require('path');
var fs = require('fs');
var mustache = require('mu2');
var merge = require('merge');
var mdRenderer = require('./md-renderer');

module.exports = function(config, filename, dest /*, argv*/) {
	var md = fs.readFileSync(filename, 'utf-8');
	var tokens = marked.lexer(md);
	// Set title.
	var title = path.basename(filename, path.extname(filename));
	for (var i = 0; i < tokens.length; i ++) {
		if (tokens[i].type === 'heading') {
			title = tokens[i].text;
			break;
		}
	}
	//	if (config.tags.title) {
	//		title = config.tags.title;
	//	}

	//if (argv['document-mode']) {
	//console.log(tokens);
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
	//}
	//console.log(md);

	var content = marked.parser(tokens);
	// Load style.
	//var style = fs.readFileSync(argv.style);
	// Load script
	//var script = argv.script ? fs.readFileSync(argv.script) : '';
	// Output

	// get path.join(config.template, 'template*.html');
	//console.log(path.join(config.template, 'template*.html'));
	var files = fs.readdirSync(config.template);
	files.forEach(function(file) {
		var suffix = '';
		if (path.extname(file) === '.html') {
			if (file.indexOf('template') === 0) {
				suffix = path.basename(file, path.extname(file)).substr('template'.length);
				console.log('--:' + suffix + '-');

				var out = process.stdout;
				//if (argv['output-file']) {
				var outputFilename = dest.substr('.vegetables'.length);
				console.log('before:', outputFilename);
				var uri = path.dirname(outputFilename) + (path.dirname(outputFilename) === '/' ? '' : '/') + path.basename(outputFilename, path.extname(outputFilename)) + suffix + '.html';
				console.log('uri:', uri);
				outputFilename = path.resolve(path.join('.vegetables', uri));
				console.log(outputFilename);
				//return;
				out = fs.createWriteStream(outputFilename);
				//}
				// Compile template and pipe it out.
				mustache.compileAndRender(path.join(config.template, file), merge({
					title: title,
					content: content,
					markdown: md,
					slideMarkdown: slideMarkdown,

					active: function() {
						return function(text, render) {
							return (render(text) === uri ? 'active' : 'not-active');
						};
					},


					currentUri: uri,
					versions: []

					// merge with config.tags
					//style: style,
					//script: script
				}, config.tags)).pipe(out);


			}
		}
	});


};
