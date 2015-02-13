'use strict';

var path = require('path');
module.exports = function (argv) {
	require('./generate')(argv, true);
	// create the express server
	var express = require('express'),
			app = express();
	app.use(express.static('./.vegetables'));
	app.listen(8888);

	// and watch:
	//https://www.npmjs.com/package/watch
	var watch = require('watch');
	watch.watchTree(
		'.',
		{
			'ignoreDotFiles': true,
			'ignoreUnreadableDir': true,
			'filter': function(file) {
				// watch template, root, not .vegetables
				console.log(file.split(path.sep)[0]);
				if (['.vegetables', 'node_modules'].indexOf(file.split(path.sep)[0]) !== -1) {
					return false;
				}
				console.log('kept file:', file);
				return true; // or false to not watch the file
			}
		},
		function (/*f, curr, prev*/) {
			//fs.watchFile(argv._[0], { interval: 100 }, function () {
			require('./generate')(argv, false);
		}
	);
};
