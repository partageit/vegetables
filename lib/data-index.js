'use strict';

//var fs = require('fs');
var htmlToText = require('html-to-text');
//var logger = require('./logger');

var dataIndex = function dataIndex() {
	var data = [];
	this.options = {};

	this.addPage = function(title, url, html, tags) {
		data.push({
			title: title,
			url: url,
			html: html,
			text: htmlToText.fromString(html),
			tags: tags
		});
	};

	this.init = function(options) {
		data = [];
		this.options = options || {};
	};
};

dataIndex.instance = null;

dataIndex.getInstance = function() {
	if (this.instance === null) {
		this.instance = new dataIndex();
	}
	return this.instance;
};

module.exports = dataIndex.getInstance();
