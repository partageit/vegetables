'use strict';

var fs = require('fs.extra');
var path = require('path');
var logger = require('./logger');
var process = require('child_process');

module.exports = function (argv) {

	var repositoryUrl;
	var tempDir = path.join('.vegetables', 'deploy');
	var creationAttempt = false; // Workaround: how to pass parameter to generate?

	var removeTempDir = function(error, stdout, stderr) {
		if (error) {
			logger.error('Web site not deployed: ', stdout, stderr);
			//return;
		}
		try {
			fs.rmrfSync(tempDir);
		} catch (e) {
			logger.debug('.vegetables were not present, deletion failed', e);
		}
	};


	var gitPush = function(error, stdout, stderr) {
		if (error) {
			logger.error('Unable to commit files:', stdout, stderr);
			removeTempDir(false);
			return;
		}
		logger.success('Files successfully commited locally');
		logger.info('About to push the Web site to GitHub pages...');
		logger.info('Git will certainly ask your credentials:');
		process.exec(
			'git push origin gh-pages',
			{cwd: tempDir},
			removeTempDir
		);
	};

	var gitCommit = function(error, stdout, stderr) {
		if (error) {
			logger.error('Unable to add/update files to commit:', stdout, stderr);
			removeTempDir(false);
			return;
		}
		process.exec(
			'git commit -m "Deployed with Vegetables - ' + new Date().toLocaleString() + '"',
			{cwd: tempDir},
			gitPush
		);
	};

	var gitAdd = function(error) {
		if (error) {
			logger.error('Unable to copy the generated Web site to the deploy folder');
			removeTempDir(false);
			return;
		}
		process.exec(
			'git add --all',
			{cwd: tempDir},
			gitCommit
		);
	};

	var generate = function(error, stdout, stderr) {
		if (!creationAttempt && error) {
			logger.info('The branch gh-pages does not seem to exist. Creating it...');
			creationAttempt = true;
			process.exec(
				'git checkout -b gh-pages',
				{cwd: tempDir},
				generate
			);
			return;
		}
		if (error) {
			logger.error('Unable to create the gh-pages branch: ', stdout, stderr);
			removeTempDir(false);
			return;
		}
		require('./generate')(argv, false);
		logger.info('Web site generated');

		// empty tempDir except .git
		var files = fs.readdirSync(tempDir);
		files.forEach(function(file) {
			var curPath = path.join(tempDir, file);
			if (fs.statSync(curPath).isDirectory()) {
				if (file !== '.git') {
					logger.debug('Removing folder %s', curPath);
					fs.rmrfSync(curPath);
				}
			} else {
				logger.debug('Removing file %s', curPath);
				fs.unlinkSync(curPath);
			}
		});

		// copy website files to tempDir
		fs.copyRecursive(
			path.join('.vegetables', 'website'),
			tempDir,
			gitAdd
		);
	};

	var checkoutBranch = function(error, stdout, stderr) {
		if (error) {
			logger.error('Unable to clone the repository: ', stdout, stderr);
			removeTempDir(false);
			return;
		}
		logger.success('Repository successfully cloned');
		process.exec(
			'git checkout -b gh-pages origin/gh-pages',
			{cwd: tempDir},
			generate
		);
	};

	var gitClone = function(error) {
		if (error) {
			logger.error('Unable to create the temporary deploy folder');
			removeTempDir(false);
			return;
		}
		process.exec(
			'git clone ' + repositoryUrl + ' ' + tempDir,
			checkoutBranch
		);
	};

	var createTempDir = function(error, stdout) {
		if (error) {
			logger.error('Unable to get the remote origin URL. Is this a GitHub repository? Is Git installed?');
			return;
		}
		repositoryUrl = stdout.trim();
		logger.info('Remote repository URL: ' + repositoryUrl);
		try {
			fs.rmrfSync('.vegetables');
		} catch (e) {
			logger.debug('.vegetables were not present, deletion failed', e);
		}
		fs.mkdirRecursive(tempDir, gitClone);
	};

	process.exec(
		'git config --get remote.origin.url',
		createTempDir
	);


};
