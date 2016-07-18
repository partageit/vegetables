'use strict';

var path = require('path');
var exec = require('sync-exec');
var fs = require('fs.extra');
var async = require('async');
var compile = require('./compile');
var compileSpecialPages = require('./compile-special-pages');
var templatesManager = require('./templates-manager');
var dataIndex = require('./data-index');
var logger = require('./logger');
var runCommands = require('./run-commands');
require('./handlebars-helpers')();

var GENERATING = false;
var QUEUED = null;


// http://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js
// var copyRecursiveSync = function(src, dest) {
//   var exists = fs.existsSync(src);
//   var stats = exists && fs.statSync(src);
//   var isDirectory = exists && stats.isDirectory();
//   if (exists && isDirectory) {
//     fs.mkdirSync(dest);
//     fs.readdirSync(src).forEach(function(childItemName) {
//       copyRecursiveSync(path.join(src, childItemName),
//                         path.join(dest, childItemName));
//     });
//   } else {
//     fs.linkSync(src, dest);
//   }
// };

module.exports = function(argv, init, callback) {
	logger.debug("Want Generate!")

	if (GENERATING) {
	  if (!QUEUED) {
			logger.debug("Queued!")
			QUEUED = setTimeout(function(){
				QUEUED = null;
				module.exports(argv, init, callback);
			}, 1000);
		}
		return;
	}


	var the_callback = callback;
	GENERATING = true;

	var callback = function(){
		GENERATING = false;
		logger.debug("Generation done")
		the_callback.apply(this, arguments);
	}

	var config = require('./read-config.js')(argv);

	if (init) {
		try {
			fs.rmrfSync('.vegetables');
		} catch (e) {
			logger.debug('.vegetables were not present, deletion failed', e);
		}
	}

	var filesToRender = {}; // filename => filename, path, versions

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
						filesToRender[curPath] = {
							filename: file,
							path: curPath,
							versions: templatesManager.getVersions(curPath, 'template')
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

	// Start before commands
	if (!runCommands(config, 'before')) {
		logger.error('Error while starting before commands');
		callback('Error while starting before commands');
		return;
	}

	// Clear and configure the templates manager
	var templates = config.template;
	if(!(templates instanceof Array)) {
		templates = [templates];
	}
	templatesManager.init({'folders': templates});

	templates.forEach(function(folder) {
		templatesManager.scanCommonTemplates(folder);
	})

	// Clear and configure data index
	dataIndex.init({});

	// Create assets folders
	try {
		fs.rmrfSync(path.join('.vegetables', 'website', 'assets'));
		fs.mkdirRecursiveSync(path.join('.vegetables', 'website', 'assets'), '0755');
	} catch (e) {}

	var foldersTodo = templates.length;

	function renderDocuments() {

				// Discover Markdown documents and copy media files
				walk('.', path.join('.vegetables', 'website'));

				// Render Markdown documents
				async.each(
					Object.keys(filesToRender),
					function(file, callback) {
						compile(config, filesToRender[file], filesToRender, callback);
					},
					function(err) {
						if (err) {
							logger.error('Compile finished with error: %s', err);
							return;
						}
						// Compile special pages (sitewide, categories and tags pages)
						async.each(
							templatesManager.getCommonTemplates(),
							function(template, callback) {

								//logger.success('template:', template);
								compileSpecialPages(config, template, callback);

							},
							function(err) {

								if (err) {
									logger.error('Compile finished with error: %s', err);
									return;
								}
								logger.debug('Compile finished successfully!');

								// Start after commands
								if (!runCommands(config, 'after')) {
									logger.error('Error while starting after commands');
									callback('Error while starting after commands');
									return;
								}

								callback();

							}
						);

					}
				);
			  }


	templates.forEach(function(templateFolder) {
		logger.debug("handle folder %s, todo: %s", templateFolder, foldersTodo);


		if (!fs.existsSync(path.join(templateFolder, 'assets'))) {
			foldersTodo -= 1;
			if (!foldersTodo) {
				renderDocuments();
			}
		} else {
			logger.debug("copy info from assets of %s", templateFolder);

			// Copy assets
			fs.copyRecursive(path.join(templateFolder, 'assets'), path.join('.vegetables', 'website', 'assets'), function(err) {
				if (err) { // file exists is considered as an error
					logger.error('Error while copying assets: %s', err);
					callback('Error while copying assets: %s', err);
					return;
				}

				logger.debug("done recursive copying of %s", templateFolder);

				foldersTodo -= 1

				if (!foldersTodo) {
					renderDocuments();
				}

			});
    }
	});
};
