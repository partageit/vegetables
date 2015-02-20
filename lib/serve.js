'use strict';

var path = require('path');
var watch = require('watch');
var express = require('express');
var logger = require('./logger');

module.exports = function (argv) {
	var config = require('./read-config.js')(argv);
	require('./generate')(argv, true);

	// create the express server
	var app = express();
	app.use(express.static(path.join('.vegetables', 'website')));
	app.listen(config.port, config.host);

	logger.success('Vegetables started, at this address: ' + (config.host === '*' ? 'localhost' : config.host) + ':' + config.port);
	logger.info('Waiting for file updates...');

	//https://www.npmjs.com/package/watch
	var firstTime = true;
	// and watch:
	watch.watchTree(
		'.',
		{
			'ignoreDotFiles': true,
			'ignoreUnreadableDir': true,
			'filter': function(file) {
				// watch template, root, not .vegetables
				//console.log('Current filtered file:', file.split(path.sep)[0]);
				if (['.vegetables', 'node_modules'].indexOf(file.split(path.sep)[0]) !== -1) {
					return false;
				}
				logger.debug('Watched file:', file);
				return true;
			}
		},
		function (f /*, curr, prev*/) {
			if (firstTime) {
				firstTime = false;
				return;
			}
			logger.info('Modified files:', f, '- Regenerating...');
			require('./generate')(argv, false);
			logger.success('Regeneration finished!');
		}
	);
};
