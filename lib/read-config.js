'use strict';
var path = require('path');
module.exports = function () {
	return {
		'tags': {
			'globalTitle': 'Web site',  // should have default
			'globalSubtitle': '',
			'baseUri': '/',
			'menu': [
				{
					'url': '/index.html',
					'label': 'Home'
				},
				{
					'url': '/tests/test.html',
					'label': 'Test'
				}
			]
		},
		pageOptions: {
			'README.md': {
				layout: 'homepage'
			}
		},
		'template': path.resolve('template'),
		'exclude': ['.vegetables', 'node_modules', 'template']
	};
};
