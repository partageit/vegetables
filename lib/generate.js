'use strict';

var fs = require('fs.extra');
var path = require('path');
var mustache = require('mustache');
var compile = require('./compile');
var logger = require('./logger');

module.exports = function(argv, init) {
	var config = require('./read-config.js')(argv);
	//console.log(config);

	if (init) {
		try {
			//recursiveRmdir('.vegetables');
			fs.rmrfSync('.vegetables');
		} catch (e) {
			logger.debug('.vegetables were not present, deletion failed', e);
		}
	}

	var filesToRender = {}; // filename => filename, path, versions
	var templates = []; // filename, suffix

	var files = fs.readdirSync(config.template);
	files.forEach(function(file) {
		if (path.extname(file) === '.html') {
			if (file.indexOf('template') === 0) {
				templates.push({
					filename: path.join(config.template, file),
					suffix: path.basename(file, path.extname(file)).substr('template'.length).substr(1)
				});
			}
		}
	});
	logger.debug('templates:', templates);

	var walk = function(folder, dest) {
		try {
			fs.mkdirSync(dest, '0755');
		} catch (e) {}
		var files = fs.readdirSync(folder);
		files.forEach(function(file) {
			if (config.exclude.indexOf(file) === -1) {
				var curPath = path.join(folder, file);
				if(fs.statSync(curPath).isDirectory()) {
					walk(curPath, path.join(dest, file));
				} else {
					if (['.md', '.markdown'].indexOf(path.extname(file).toLowerCase()) !== -1) {
						//console.log(curPath + ' to ' + dest);
						var versions = [];
						templates.forEach(function(template) {
							versions.push({
								template: (template.suffix ? template.suffix : 'default'),
								templateFile: template.filename,
								uri:
								path.join(
									path.dirname(curPath),
									//(path.dirname(curPath) === '' ? '' : '/') +
									(path.basename(curPath, path.extname(curPath)).toLowerCase() === 'readme' ? 'index' : path.basename(curPath, path.extname(curPath))) +
									(template.suffix ? '-' : '') + template.suffix + '.html'
								).replace(/\\/g, '\/')
							});
						});

						filesToRender[curPath] = {
							filename: file,
							path: curPath,
							versions: versions
						};
					} else if (config.media.indexOf(path.extname(file).toLowerCase().substr(1)) !== -1) {
						logger.log('Copy "%s" to "%s"', curPath, path.join(dest, path.basename(curPath)));
						fs.copy(curPath, path.join(dest, path.basename(curPath)), {replace: true}, function(err) {
							if (err) {
								logger.error('Problem while copying media file "%s" to "%s": "%s"', curPath, path.join(dest, path.basename(curPath)), err);
							}
						});
					}
				}
			}
		});
	};

	mustache.clearCache();

	walk('.', '.vegetables');
	try {
		fs.mkdirSync(path.join('.vegetables', 'assets'), '0755');
	} catch (e) {}
	fs.copyRecursive(path.join(config.template, 'assets'), path.join('.vegetables', 'assets'), function() {});

	Object.keys(filesToRender).forEach(function(file) {
		//console.log('To render:', filesToRender[file]);
		compile(config, filesToRender[file], filesToRender);
	});

};
