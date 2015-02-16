'use strict';

var path = require('path');
var watch = require('watch');
var express = require('express');

module.exports = function (argv) {
	var config = require('./read-config.js')(argv);
	require('./generate')(argv, true);

	// create the express server
	var app = express();
	app.use(express.static('./.vegetables'));
	app.listen(config.port, config.host);

	console.log('Vegetables started, at this address: ' + (config.host === '*' ? 'localhost' : config.host) + ':' + config.port);

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
				//console.log('kept file:', file);
				return true;
			}
		},
		function (f /*, curr, prev*/) {
			if (firstTime) {
				firstTime = false;
				return;
			}
			console.log('Modified files:', f);
			console.log('Regenerating...');
			require('./generate')(argv, false);
			console.log('Regeneration finished!');
		}
	);
};
