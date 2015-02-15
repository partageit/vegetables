'use strict';

var fs = require('fs.extra');
var path = require('path');
var compile = require('./compile');
var mustache = require('mustache');

module.exports = function(argv, init) {
	var config = require('./read-config.js')();
	console.log(config);
	//	require('../lib/validate')(argv);

	if (init) {
		try {
			//recursiveRmdir('.vegetables');
			fs.rmrfSync('.vegetables');
		} catch (e) {
			console.log('.vegetables were not present, deletion failed', e);
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
	//console.log('templates:', templates);

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
					if (path.extname(file).toLowerCase() === '.md') {
						console.log(curPath + ' to ' + dest);
						// update file.versions suffix => uri
						//compile(config, curPath, dest + '/' + (folder + '/' + file === './README.md' ? 'index.md' : file)/*, argv*/);

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
								).replace('\\', '/')
							});
						});

						filesToRender[curPath] = {
							filename: file,
							path: curPath,
							versions: versions
						};
					}/* else if (in array) {
						toRender = false, filename, path, uri, type <- no!
						only copy
					}*/
				}
			}
		});
	};

	mustache.clearCache();

	// get templates and calculate suffix name

	walk('.', '.vegetables');
	try {
		fs.mkdirSync(path.join('.vegetables', 'assets'), '0755');
	} catch (e) {}
	fs.copyRecursive(path.join(config.template, 'assets'), path.join('.vegetables', 'assets'), function() {});



	Object.keys(filesToRender).forEach(function(file) {
		console.log('To render:', filesToRender[file]);
			compile(config, filesToRender[file], filesToRender);
	});

};
