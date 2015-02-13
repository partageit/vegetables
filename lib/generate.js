'use strict';

var fs = require('fs.extra');
var path = require('path');
var compile = require('./compile');
var mustache = require('mu2');

module.exports = function(argv, init) {
	var config = require('./read-config.js')();
	console.log(config);
	//	require('../lib/validate')(argv);

	if (init) {
		try {
			//recursiveRmdir('.vegetables');
			fs.rmrfSync('.vegetables');
		} catch (e) {
			console.log('.vegetables were not present, deletion failed', e);
		}
	}


	var walk = function(folder, dest) {
		try {
			fs.mkdirSync(dest, '0755');
		} catch (e) {}
		var files = fs.readdirSync(folder);
		files.forEach(function(file) {
			if (config.exclude.indexOf(file) === -1) {
				var curPath = folder + '/' + file;
				if(fs.statSync(curPath).isDirectory()) {
					walk(curPath, dest + '/' + file);
				} else {
					if (path.extname(file).toLowerCase() === '.md') {
						console.log(curPath + ' to ' + dest);
						compile(config, curPath, dest + '/' + (folder + '/' + file === './README.md' ? 'index.md' : file)/*, argv*/);
					}
				}
			}
		});
	};

	mustache.clearCache();
	walk('.', '.vegetables');
	try {
		fs.mkdirSync(path.join('.vegetables', 'assets'), '0755');
	} catch (e) {}
	fs.copyRecursive(path.join(config.template, 'assets'), path.join('.vegetables', 'assets'), function() {});

};
