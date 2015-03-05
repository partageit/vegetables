'use strict';

var path = require('path');
var exec = require('sync-exec');
var fs = require('fs.extra');
var mustache = require('mustache');
var async = require('async');
var compile = require('./compile');
var logger = require('./logger');

module.exports = function(argv, init, callback) {
	var config = require('./read-config.js')(argv);
	//console.log(config);

	if (init) {
		try {
			fs.rmrfSync('.vegetables');
		} catch (e) {
			logger.debug('.vegetables were not present, deletion failed', e);
		}
	}

	var filesToRender = {}; // filename => filename, path, versions
	var templates = []; // filename, suffix

	// Get default template files
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

	// Function to discover Markdown files and copy media files
	var walk = function(folder, dest) {
		try {
			fs.mkdirSync(dest, '0755');
		} catch (e) {}
		var files = fs.readdirSync(folder);
		files.forEach(function(file) {
			if (config.exclude.indexOf(file) === -1) {
				var curPath = path.join(folder, file);
				if (fs.statSync(curPath).isDirectory()) {
					walk(curPath, path.join(dest, file));
				} else {
					if (['.md', '.markdown'].indexOf(path.extname(file).toLowerCase()) !== -1) {
						//console.log(curPath + ' to ' + dest);
						var versions = [];
						templates.forEach(function(template) {
							versions.push({
								format: (template.suffix ? template.suffix : 'default'),
								templateFile: template.filename,
								uri:
								path.join(
									path.dirname(curPath),
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
			} else {
				logger.debug('Excluded:', file);
			}
		});
	};

	// Function to start before and after commands
	var runCommands = function(commands) {
		if (!commands || (commands.length === 0)) {
			return true;
		}
		if (typeof commands === 'string') {
			commands = [commands];
		}
		return commands.every(function(command) {
			logger.info('Starting command "%s"...', command);
			var result = exec(
				command,
				{cwd: path.resolve('.')}
			);
			if (result.status !== 0) { // error
				logger.error('Error: "%s" - "%s"', result.stdout, result.stderr.trim());
				return false;
			}
			logger.success('Command successfully finished');
			logger.log('Command result: "%s"', result.stdout);
			return true;
		});
	};

	// Start before commands
	if (!runCommands(config.before)) {
		logger.error('Error while starting before commands');
		callback('Error while starting before commands');
		return;
	}

	// Clear Mustache cache
	mustache.clearCache();

	// Unset templates sources cache
	var templatesCache = {};

	// Create assets folders
	try {
		fs.mkdirRecursiveSync(path.join('.vegetables', 'website', 'assets'), '0755');
	} catch (e) {}

	// Copy assets
	fs.copyRecursive(path.join(config.template, 'assets'), path.join('.vegetables', 'website', 'assets'), function(/*err*/) {
		//if (err) { // file exists is considered as an error
		//	logger.error('Error while copying assets: %s', err);
		//	callback('Error while copying assets: %s', err);
		//	return;
		//}

		// Discover Markdown documents and copy media files
		walk('.', path.join('.vegetables', 'website'));

		// Render Markdown documents
		async.each(
			Object.keys(filesToRender),
			function(file, callback) {
				compile(config, filesToRender[file], filesToRender, templatesCache, callback);
			},
			function(err) {
				if (err) {
					logger.error('Compile finished with error: %s', err);
					return;
				}
				logger.debug('Compile finished successfully!');
				// Start after commands
				if (!runCommands(config.after)) {
					logger.error('Error while starting after commands');
					callback('Error while starting after commands');
					return;
				}
				callback();
			}
		);
	});
};
