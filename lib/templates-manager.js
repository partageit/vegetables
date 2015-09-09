'use strict';

var path = require('path');
var fs = require('fs');
var logger = require('./logger');
var handlebars = require('handlebars');

var templatesManager = function templatesManager() {
	var templates = {}; // {'template': [{suffix: 'default', filename: 'template/template.html'}, {...}], 'layout-homepage': [...]}
	var compiled = {}; // {'template.html': compiled template, 'layout-homepage.html': compiled template, ...}
	var commonTemplates = []; // [{'type': 'site', 'target': 'sitemap.html', filename: 'template/per-site-sitemap.html'}, {...}]
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
		var versions = {};
		templates[layout].forEach(function(template) {
			versions[template.suffix] = {
				format: template.suffix,
				templateFile: template.filename,
				uri: path.join(
					path.dirname(filename),
					(path.basename(filename, path.extname(filename)).toLowerCase() === 'readme' ? 'index' : path.basename(filename, path.extname(filename))) +
					(template.suffix === 'default' ? '' : '-' + template.suffix) + '.html'
				).replace(/\\/g, '\/')
			};
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

	this.scanCommonTemplates = function() {
		var folder = this.options.folder;
		var files = fs.readdirSync(folder);
		var source;
		files.forEach(function(file) {
			// partial templates, to be included in main templates
			if ((file.indexOf('partial-') === 0) && (path.extname(file) === '.html')) {
				try {
					source = fs.readFileSync(path.join(folder, file), {encoding: 'utf-8'});
					handlebars.registerPartial(
						path.basename(file, path.extname(file)).substr('partial-'.length),
						source);
				} catch (e) {
					logger.error('Partial read error "%s": %s', file, e);
				}

			} else if (file.indexOf('per-') === 0) { // other common templates (site, category, tag)
				var filenameParts = file.split('-');
				filenameParts.shift(); // remove 'per-'
				var type = filenameParts.shift();
				var target = filenameParts.join('-');
				commonTemplates.push({
					type: type,
					target: target,
					filename: path.join(folder, file)
				});
				//logger.success('commonTemplates', commonTemplates);
			}
		});
	};

	this.getCommonTemplates = function() {
		return commonTemplates;
	};

	this.init = function(options) {
		templates = {};
		commonTemplates = [];
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
