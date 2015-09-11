'use strict';

//var logger = require('./logger');
var merge = require('merge');

var dataIndex = function dataIndex() {
	var pages = [];
	var categories = {}; // {'cat1': [ {page1}, {page2}, {...} ], 'cat2': ...}
	var tags = {}; // idem
	this.options = {};

	this.addPage = function(title, html, fileInfo, pageTags) {
		var currentCategory = (pageTags.category ? pageTags.category : '');
		var currentTags = (pageTags.tags ? pageTags.tags : []);
		var uri = '';

		if (fileInfo.versions['default']) {
			uri = fileInfo.versions['default'].uri;
		} else if (Object.keys(fileInfo.versions).length !== 0) {
			uri = fileInfo.versions[Object.keys(fileInfo.versions)[0]].uri;
		}

		var page = merge(true, {
			title: title,
			html: html,
			uri: uri,
			fileInfo: fileInfo,
			pageTags: pageTags,
			category: currentCategory,
			tags: currentTags
		}, pageTags);
		pages.push(page);

		if (!categories[currentCategory]) {
			categories[currentCategory] = [];
		}
		categories[currentCategory].push(page);

		currentTags.forEach(function(tag) {
			if (!tags[tag]) {
				tags[tag] = [];
			}
			tags[tag].push(page);
		});

	};

	this.getPages = function(type, item) {
		type = type || 'site';
		switch (type) {
			case 'site': return pages;
			case 'category': return categories[item];
			case 'tag':      return tags[item];
		}
		return [];
	};

	this.getCategories = function() { return Object.keys(categories); };
	this.getTags = function() { return Object.keys(tags); };

	this.init = function(options) {
		pages = [];
		categories = [];
		tags = [];
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
