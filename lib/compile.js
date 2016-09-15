'use strict';

var marked = require('marked');
var path = require('path');
var fs = require('fs');
var merge = require('merge');
var yaml = require('js-yaml');
var mdRenderer = require('marked-to-md');
var uriRewriteRenderer = require('./url-rewrite-renderer');
var templatesManager = require('./templates-manager');
var dataIndex = require('./data-index.js');
var logger = require('./logger');
var child_process = require('child_process');
var runCommand = require('./run-commands.js');

module.exports = function(config, file, filesToRender, callback) {
	logger.debug('file to compile:', file);
	logger.debug("compile: ", config, file, filesToRender);

	// Common values ************************************************************
	var document = file.path.replace(/\\/g, '\/');
	var baseUri = (new Array(path.normalize(file.path).split(path.sep).length)).join('..' + path.sep).replace(/\\/g, '\/');
	logger.debug('baseUri:', baseUri);

	var md = fs.readFileSync(file.path, 'utf-8');

	// Get wildcard page options ************************************************
	var wildcardPageOptions = {};
	if (config.pageOptions) {
		Object.keys(config.pageOptions).forEach(function(optionsDocument) {
			if (optionsDocument.search(/[\*\?]/) !== -1) {
				if (document.search(new RegExp('^' + optionsDocument.replace(/\*/g, '.*').replace(/\?/g, '.+') + '$')) !== -1) {
					wildcardPageOptions = merge(true, wildcardPageOptions, config.pageOptions[optionsDocument]);
					logger.debug('Wildcard page options found for %s:', document, wildcardPageOptions);
				}
			}
		});
	}

	// Get page options from configuration file *********************************
	var pageOptions = {};
	if (config.pageOptions && config.pageOptions[document]) {
		pageOptions = config.pageOptions[document];
		logger.debug('Page options are defined for %s:', document, pageOptions);
	}

	md = md.replace(/\r\n/g, '\n');

	// Filter markdown input
	md = runCommand(config, 'filterMarkdown', md);

	// Get tags from Frontmatter ************************************************
	var documentTags = {};

	// Extract and parse front matter
	if (md.substr(0, 4) === '---\n') {
		logger.debug('Frontmatter found');
		var frontmatterBlock = md.substr(4, md.indexOf('\n---\n') - 4);
		md = md.substr(md.indexOf('\n---\n') + 4);
		logger.debug('Frontmatter block:', frontmatterBlock);
		// if first char of extracted content is ", [ or {, it is json, else it is yaml
		if (frontmatterBlock.trim().substr(0) === '{') { // json
			try {
				documentTags = JSON.parse(frontmatterBlock);
			} catch(e) {
				logger.error('Invalid JSON in frontmatter of %s:', document, e);
			}
		} else { // yaml
			try {
				documentTags = yaml.safeLoad(frontmatterBlock);
			} catch(e) {
				logger.error('Invalid YAML in frontmatter of %s:', document, e);
			}

		}
	}

	// Get tags from Markdown references ****************************************
	var tokens = marked.lexer(md);
	// Get reference tags from documents, which have a bigger priority above frontmatter's ones
	Object.keys(tokens.links).forEach(function(link) {
		if (link.indexOf('tag-') === 0) {
			documentTags[link.substr('tag-'.length)] = tokens.links[link].title;
		}
	});
	//logger.debug('documentTags:', documentTags);
	logger.debug('documentTags:', documentTags);

	// Merge common tags ********************************************************
	var commonTags = merge(true, config.tags, wildcardPageOptions, pageOptions, documentTags);
	logger.debug('commonTags:', commonTags);

	// Get page layout **********************************************************
	if (commonTags.layout) {
		var versions = templatesManager.getVersions(file.path, 'layout-' + commonTags.layout);
                logger.debug("Versions: ", versions);

		if (versions.length) {
			file.versions = versions;
		} else {
			logger.info('Warning: the layout "%s" used in "%s" does not exist. Using the default one.', commonTags.layout, file.path);
		}
	}

	// Get page title ***********************************************************
	var title = path.basename(file.path, path.extname(file.path));
	for (var i = 0; i < tokens.length; i ++) {
		if (tokens[i].type === 'heading') {
			title = tokens[i].text;
			break;
		}
	}

	// Rewrite URIs and table of content tag ************************************
	var uriRenderer = uriRewriteRenderer(new marked.Renderer(), baseUri, file, filesToRender);
	var toc = [];
	for (i = 0; i < tokens.length; i++) {
		// Rewrite URIs (Markdown files to rendered HTML files)
		if (tokens[i].text && (tokens[i].type !== 'code')) {
			tokens[i].text = marked.inlineLexer(tokens[i].text, tokens.links, {renderer: uriRenderer});
			//logger.debug(tokens[i].text);
		}
		// Create toc
		if (tokens[i].type === 'heading') {
			//logger.debug('heading:', tokens[i]);
			// anchor id is (this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-'))
			toc.push({
				title: tokens[i].text,
				depth: tokens[i].depth,
				anchor: tokens[i].text.toLowerCase().replace(/[^\w]+/g, '-')
			});
		}
	}

	var headingProperties = [
		'class: center, middle, main-title',
		'class: center, middle, main',
	]

	if (config.headingProperties) {
		headingProperties = config.headingProperties;
	}

	// Begin Markdown for slideshow *********************************************
	var updatedTokens = [];
	for (i = 0; i < tokens.length; i++) {
		if ((i !== 0) && (tokens[i].type === 'heading') && (tokens[i].depth <= 3) && (tokens[i-1].type !== 'hr')) {
			updatedTokens.push({'type': 'hr'});
		}
		if (tokens[i].type === 'heading') {
			if ((i === tokens.length - 1) || (tokens[i+1].type === 'heading')) {
				if (headingProperties[i-1]) {
					updatedTokens.push({'type': 'paragraph', 'text': headingProperties[i-1]});
				}
			}
		}
		updatedTokens.push(tokens[i]);
	}
	updatedTokens.links = tokens.links;
	//logger.debug(updatedTokens);
	var renderer = mdRenderer(new marked.Renderer());
	var parser = new marked.Parser({renderer: renderer});
	var slideMarkdown = parser.parse(updatedTokens);

	// HTML content *************************************************************
	var content = marked.parser(tokens);

	// Filter HTML output
	content = runCommand(config, 'filterHTML', content);

	// Autoreload tag ***********************************************************
	var autoReload = '';
	console.log("autoReload? ", config.mode, config.serveAutoReload)
	if ((config.mode === 'serve') && config.serveAutoReload) {
		autoReload = '<script src="/socket.io/socket.io.js"></script>' +
			'<script>' +
			'socket = io.connect();' +
			'socket.on(\'reload\', function() { console.log("reload: ", location); location.reload(); });' +
			'</script>';
	}

	// Add content to index *****************************************************
	dataIndex.addPage(title, content, file, commonTags);

	// Generate Web pages *******************************************************
	var callbackCounter = Object.keys(file.versions).length;
	// maybe: for (var version in file.versions) { // ?
	Object.keys(file.versions).forEach(function(versionFormat) {
                logger.debug("version:", versionFormat);
		var version = file.versions[versionFormat];
		var outputFilename = path.resolve(path.join('.vegetables', 'website', version.uri));
		logger.log('Generating: ', outputFilename);

		// Local handlebars helpers
		var helpers = {
			'active': function(uri) {
				return (uri === version.uri ? 'active' : '');
			},

			'activeDocument': function(uri) {
				return (uri === file.path.replace(/\\/g, '\/') ? 'active' : '');
			},

			'uriByVersion': function(format) {
				if (file.versions[format]) {
					return file.versions[format].uri;
				}
				if (Object.keys(file.versions).length !== 0) {
					return file.versions[Object.keys(file.versions)[0]].uri;
				}
				return '';
			}
		};

		// Render template and write it
		var tags = merge(true, {
			// Common tags
			title: title,
			baseUri: baseUri,
			document: document,
			format: version.format,
			content: content,
			markdown: md,
			slideMarkdown: slideMarkdown,
			toc: toc,
			timestamp: (new Date()).toLocaleString(),
			currentUri: version.uri,
			versions: Object.keys(file.versions).map(function (key) { return file.versions[key]; }),
			autoReload: autoReload
		}, commonTags); // Configuration and in-document tags

		tags = runCommand(config, 'setupTags', tags)


		try {
                	logger.debug("template file:", version.templateFile);
			var template = templatesManager.getCompiledTemplate(version.templateFile);
			var rendered = template(tags, {helpers: helpers});

			fs.writeFile(outputFilename, rendered, {encoding: 'utf-8'}, function(err) {
				if (--callbackCounter === 0) {
					callback(err);
				}
			});
		} catch(e) {
			logger.error('Error while rendering the document "%s" from template "%s": %s', outputFilename, version.templateFile, e);
			--callbackCounter;
		}

	});


};
