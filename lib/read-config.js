'use strict';
var path = require('path');
module.exports = function () {
	return {
		'tags': {
			'globalTitle': 'Web site',
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
		'template': path.resolve('template'),
		'exclude': ['.vegetables', 'node_modules', 'template']
	};
};
