'use strict';
var path = require('path');
var fs = require('fs');
var merge = require('merge');
var yaml = require('js-yaml');
var logger = require('./logger');
module.exports = function (argv) {
	var configFilename;
	// File configuration is provided by CLI parameters, or vegetables.yml or vegetables.json, or none
	if (argv.config !== '') {
		if (!fs.existsSync(argv.config)) {
			logger.error('Configuration file "%s" not found', argv.config);
		} else {
			configFilename = argv.config;
		}
	}
	if (!configFilename) {
		if (fs.existsSync(path.resolve('vegetables.yml'))) {
			configFilename = path.resolve('vegetables.yml');
		} else if (fs.existsSync(path.resolve('vegetables.json'))) {
			configFilename = path.resolve('vegetables.json');
		}
	}
	logger.log('Configuration file found: "%s"', configFilename);

	var fileConfiguration = {};
	var configFileContent;
	if (configFilename) {
		try {
			configFileContent = fs.readFileSync(configFilename);
		} catch(e) {
			logger.error('Configuration file "%s" is not readable', configFilename);
		}
		if (configFileContent) {
			if (path.extname(configFilename).toLowerCase() === '.yml') {
				try {
					fileConfiguration = yaml.safeLoad(configFileContent);
				} catch(e) {
					logger.error('Invalid YAML in "%s": "%s":', configFilename, e);
				}
			} else {
				try {
					fileConfiguration = JSON.parse(configFileContent);
				} catch(e) {
					logger.error('Invalid JSON in "%s": "%s":', configFilename, e);
				}
			}
		}
	}

	var defaults = {
		tags: {
			globalTitle: 'Web site',
			menu: [],
			slideshow: { headingLevel: 3 }
		},
		template: path.resolve('template'),
		exclude: ['.vegetables', 'node_modules', '.git', 'template'],
		port: 8888,
		host: 'localhost',
		serveAutoReload: true,
		serveAutoOpen: true,
		media: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'html', 'htm'],
		mode: 'unknown',
		before: '',
		after: ''//,
		//searchEngine: true
	};


	if (fileConfiguration.additionalMedia) {
		defaults.media = defaults.media.concat(fileConfiguration.additionalMedia);
	}

	var config = merge(true, defaults, fileConfiguration);
	config.tags = merge(true, defaults.tags, config.tags);

	// Set configuration from CLI parameters
	if (argv._ && argv._[0]) {
		config.mode = argv._[0]; // mode is deploy, serve, generate
	}
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
