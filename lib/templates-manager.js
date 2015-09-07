'use strict';

var path = require('path');
var fs = require('fs');
var logger = require('./logger');
var handlebars = require('handlebars');

var templatesManager = function templatesManager() {
	var templates = {}; // {'template': [{suffix: 'default', filename: 'template/template.html'}, {...}], 'layout-homepage': [...]}
	var compiled = {}; // {'template.html': compiled template, 'layout-homepage.html': compiled template, ...}
	this.options = {};

	this.scanTemplates = function(layout) {
		var folder = this.options.folder;
		var files = fs.readdirSync(folder);
		templates[layout] = [];
		files.forEach(function(file) {
			if (path.extname(file) === '.html') {
				if (file.indexOf(layout) === 0) {
					var suffix = path.basename(file, path.extname(file)).substr(layout.length).substr(1);
					templates[layout].push({
						filename: path.join(folder, file),
						suffix: (suffix ? suffix : 'default')
					});
				}
			}
		});
	};

	this.getVersions = function(filename, layout) {
		if (!templates[layout]) {
			this.scanTemplates(layout);
		}
		var versions = [];
		templates[layout].forEach(function(template) {
			versions.push({
				format: template.suffix,
				templateFile: template.filename,
				uri: path.join(
					path.dirname(filename),
					(path.basename(filename, path.extname(filename)).toLowerCase() === 'readme' ? 'index' : path.basename(filename, path.extname(filename))) +
					(template.suffix === 'default' ? '' : '-' + template.suffix) + '.html'
				).replace(/\\/g, '\/')
			});
		});
		return versions;
	};

	this.getCompiledTemplate = function(layoutVersionFile) {
		if (!compiled[layoutVersionFile]) {
			var sources;
			logger.debug('Template %s was not in cache', layoutVersionFile);
			try {
				sources = fs.readFileSync(layoutVersionFile, {encoding: 'utf-8'});
			} catch (e) {
				logger.error('Template read error "%s": %s', layoutVersionFile, e);
				return undefined;
			}
			compiled[layoutVersionFile] = handlebars.compile(sources);
		}
		return compiled[layoutVersionFile];
	};

	this.scanPartials = function() {
		var folder = this.options.folder;
		var files = fs.readdirSync(folder);
		files.forEach(function(file) {
			if ((file.indexOf('partial-') === 0) && (path.extname(file) === '.html')) {
				try {
					var partialSource = fs.readFileSync(path.join(folder, file), {encoding: 'utf-8'});
					handlebars.registerPartial(
						path.basename(file, path.extname(file)).substr('partial-'.length),
						partialSource);
				} catch (e) {
					logger.error('Partial read error "%s": %s', file, e);
				}
			}
		});
	};

	this.init = function(options) {
		templates = {};
		compiled = {};
		this.options = options;
	};
};

templatesManager.instance = null;

templatesManager.getInstance = function() {
	if (this.instance === null) {
		this.instance = new templatesManager();
	}
	return this.instance;
};

module.exports = templatesManager.getInstance();
