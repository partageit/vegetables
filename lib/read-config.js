'use strict';
var path = require('path');
var fs = require('fs');
var merge = require('merge');
var logger = require('./logger');
module.exports = function (argv) {
	var configFilename = path.resolve('vegetables.json');
	if (argv.config !== '') {
		configFilename = argv.config;
	}
	var fileConfiguration = {};
	var configFileContent;
	try {
		configFileContent = fs.readFileSync(configFilename);
		logger.log('Configuration file found');
	} catch(e) {
		if (argv.config !== '') {
			logger.error('Configuration file "%s" not found', argv.config);
		}
	}
	if (configFileContent) {
		try {
			fileConfiguration = JSON.parse(configFileContent);
		} catch(e) {
			console.log('JSON problem with the configuration file', e);
		}

		//console.log(fileConfiguration);
		if (fileConfiguration.host && fileConfiguration.host === '*') {
			fileConfiguration.host = undefined;
		}
	}

	//console.log('content from config file: ', fileConfiguration);

	var defaults = {
		tags: {
			globalTitle: 'Web site',
			menu: []
		},
		template: path.resolve('template'),
		exclude: ['.vegetables', 'node_modules', '.git', 'template'],
		port: 8888,
		host: 'localhost',
		media: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'html', 'htm']
	};

	if (!fs.existsSync(defaults.template)) {
		defaults.template = path.join(__dirname, '..', 'template');
	}

	if (fileConfiguration.additionalMedia) {
		defaults.media = defaults.media.concat(fileConfiguration.additionalMedia);
	}


	logger.debug('Configuration:', merge(defaults, fileConfiguration));

	return merge(defaults, fileConfiguration /* , some args from argv */);
};
