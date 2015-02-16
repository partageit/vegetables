'use strict';
var path = require('path');
var fs = require('fs');
var merge = require('merge');
module.exports = function () {
	var configFilename = path.resolve('vegetables.json');
	var fileConfiguration = {};
	var configFileContent;
	try {
		configFileContent = fs.readFileSync(configFilename);
		console.log('Configuration file found');
	} catch(e) {}
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
			baseUri: '/',
			menu: []
		},
		template: path.resolve('template'),
		exclude: ['.vegetables', 'node_modules', 'template'],
		port: 8888,
		host: 'localhost'
	};


	//console.log('Merged configuration:', merge(defaults, fileConfiguration));

	return merge(defaults, fileConfiguration /* , args from argv */);
};
