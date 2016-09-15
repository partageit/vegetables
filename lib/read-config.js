'use strict';
var path = require('path');
var fs = require('fs');
var merge = require('merge');
var yaml = require('js-yaml');
var logger = require('./logger');

var hookNames = ['hooks', 'before', 'after', 'filterMarkdown',
	'filterHTML', 'setupTags']

function loadHooks(config, configDir) {
	for (var key in config) {
		if (hookNames.indexOf(key) > -1) {
			logger.debug('have hook "%s"', key)

			var hook = config[key]
			if (!(hook instanceof Array)) hook = [ hook ]
			config[key] = hook.map((h) => {
				if (typeof(h) === 'string') {
					h = {"module": h}
				}
				logger.debug('hook %s', h)
				var moduleName = path.resolve(configDir, h.module)
				logger.debug('hook %s, moduleName %s', h, moduleName)

				if (fs.existsSync(moduleName)) {
					logger.debug('%s exists', moduleName)
					try {
						return { 'hookFile': moduleName, 'hookFunction': require(moduleName) }
					}
					catch(e) {
						logger.error('Could not require %s:', moduleName, e)
					}
				}
				return h
			})
		}
	}
	logger.debug("config: %s", JSON.stringify(config))
}

function getConfigFromFile(configFilename) {
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
	loadHooks(fileConfiguration, path.resolve(path.dirname(configFilename)))

	return fileConfiguration
}

module.exports = function (argv) {
	var configFilename;

	// if config is already an object, simply return it
	if (typeof argv.config === 'object') {
		return argv.config;
	}

	// File configuration is provided by CLI parameters, or vegetables.yml or vegetables.json, or none
	if (argv.config !== '') {
		if (!fs.existsSync(argv.config)) {
			logger.error('Configuration file "%s" not found', argv.config);
		} else {
			configFilename = argv.config;
		}
	}

	function getDefaultConfigFilename(configFilename) {
		if (configFilename) return configFilename

		if (fs.existsSync(path.resolve('vegetables.yml'))) {
			return path.resolve('vegetables.yml');
		} else if (fs.existsSync(path.resolve('vegetables.json'))) {
			return path.resolve('vegetables.json');
		}
	}

	configFilename = getDefaultConfigFilename(configFilename)

	logger.debug('Configuration file found: "%s"', configFilename);

	var fileConfiguration = getConfigFromFile(configFilename);

	var defaults = {
		tags: {
			globalTitle: 'Web site',
			menu: []
		},
		template: path.resolve(__dirname, '..', 'template'),
		exclude: ['.vegetables', 'node_modules', '.git', 'template', 'bower_components'],
		port: 8888,
		host: 'localhost',
		serveAutoReload: true,
		serveAutoOpen: true,
		media: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'html', 'htm'],
		mode: 'unknown',
		before: '',
		filterMarkdown: '',
		filterHTML: '',
		after: ''//,

		//searchEngine: true
	};

	if (fileConfiguration.additionalMedia) {
		defaults.media = defaults.media.concat(fileConfiguration.additionalMedia);
	}

	var config = merge(defaults, fileConfiguration);

	// Set configuration from CLI parameters
	if (argv._ && argv._[0]) {
		config.mode = argv._[0]; // mode is deploy, serve, generate
	}
	if (argv.globaltitle) {
		config.tags.globalTitle = argv.globaltitle;
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

	var setupTemplateConfig = function(config, configDir) {
		if (config.template) {
			var templates = config.template
			if (!(templates instanceof Array)) templates = [ templates ]
			config.template = templates.map((p) => {
				try {
					var tp = path.resolve(require.resolve(template), '..', 'template')
					if (fs.existsSync(tp)) {
						return tp
					}
				} catch (e) {
					return path.resolve(configDir, p)
				}
			})
		}
	}

/*
	if (!fs.existsSync(config.template)) {
		config.template = path.join(__dirname, '..', 'template');
		if (argv.template) {
			logger.error('Template folder %s does not exist, using default one', argv.template);
		} else if (fileConfiguration.template) {
			logger.error('Template folder %s does not exist, using default one', fileConfiguration.template);
		}
	}

	config.template = [ path.resolve(config.template) ]
*/
	setupTemplateConfig(config, path.dirname(configFilename))

	logger.debug('Configuration:', config);

	config.update = function(config) {
		logger.info("update configuration from", config)
		if (typeof(config) === 'string') {
			var configFile = getDefaultConfigFilename(config)
			var thisConfig = getConfigFromFile(configFile)
			var configDir = path.resolve(path.dirname(configFile))
		} else {
			var thisConfig = config
			var configDir = path.resolve('.')
		}

		setupTemplateConfig(thisConfig, configDir)

		for (var k in thisConfig) {
			if (this[k]) {
				if (this[k] instanceof Array) {
					this[k] = this[k].concat(thisConfig[k])
				} else if (typeof this[k] === 'object'){
					this[k] = merge(this[k], thisConfig[k])
				} else {
					this[k] = this[k]
				}
			}
			else {
				this[k] = thisConfig[k]
			}
		}

		if (this.template) {
		 	var tpl = this.template
		 	this.template = tpl.filter(  (item, pos) => (tpl.indexOf(item) == pos) )
		}

		return this
	}

	return config;
}
