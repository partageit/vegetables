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
			logger.error('JSON problem with the configuration file', e);
		}
	}

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

	if (fileConfiguration.additionalMedia) {
		defaults.media = defaults.media.concat(fileConfiguration.additionalMedia);
	}

	var config = merge(defaults, fileConfiguration);

	// Set configuration from CLI parameters
	if (argv.globaltitle) {
		config.tags.globalTitle = argv.globaltitle;
	}
	if (argv.template) {
		config.template = argv.template;
	}
	if (argv.port) {
		config.port = argv.port;
	}
	if (argv.host) {
		config.host = argv.host;
	}

	// Rework config
	if (config.host === '*') {
		config.host = undefined;
	}

	if (!fs.existsSync(config.template)) {
		config.template = path.join(__dirname, '..', 'template');
		if (argv.template) {
			logger.error('Template folder %s does not exist, using default one', argv.template);
		} else if (fileConfiguration.template) {
			logger.error('Template folder %s does not exist, using default one', fileConfiguration.template);
		}
	}

	logger.debug('Configuration:', config);

	return config;
};
