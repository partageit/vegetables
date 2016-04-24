'use strict';

var path = require('path');
var express = require('express');
var watch = require('watch');
var openBrowser =require('open');
var logger = require('./logger');

module.exports = function (argv) {
	var config = require('./read-config.js')(argv);

	// create the express server
	var app = express();
	app.use(express.static(path.join('.vegetables', 'website')));
	var server = require('http').createServer(app);
	server.listen(config.port, config.host);
	var io;
	if (config.serveAutoReload) {
		io = require('socket.io').listen(server);
		//io.on('connection', function(){ console.log('Client connected'); });
	}

	logger.success('Vegetables started, at this address: localhost:' + config.port);
	logger.info('It is available %s', (config.host ? 'from this computer only' : 'from your network'));

	require('./generate')(argv, true, function(err) {
		if (err) {
			logger.error('First regeneration finished with errors');
		}
		if (config.serveAutoOpen) {
			openBrowser('http://localhost:' + config.port);
		}
		logger.info('Waiting for file updates...');
	});

	var firstTime = true;
	// and watch:
	watch.watchTree(
		'.',
		{
			'ignoreDotFiles': true,
			'ignoreUnreadableDir': true,
			'filter': function(file) {
				// watch template, root, not .vegetables
				if (['.vegetables', 'node_modules'].indexOf(file.split(path.sep)[0]) !== -1) {
					return false;
				}
				logger.debug('Watched file:', file);
				return true;
			}
		},
		function (f) {
			if (firstTime) {
				firstTime = false;
				return;
			}
			logger.info('Modified files:', f, '- Regenerating...');
			require('./generate')(argv, false, function(err) {
				if (err) {
					logger.error('Regeneration finished with errors');
					return;
				}
				logger.success('Regeneration finished!');
				if (config.serveAutoReload) {
					io.sockets.emit('reload');
				}
			});
		}
	);
};
