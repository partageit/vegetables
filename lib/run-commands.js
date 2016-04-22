spawnSync = require('child_process').execSync;

// Function to start before and after commands
module.exports = function(config, stage, content) {
	commands = config[stage] || config['hooks'];

	if (!commands || (commands.length === 0)) {
    return content ? content : true;
	}
	if (typeof commands === 'string') {
		commands = [commands];
	}

	return commands.every(function(command) {
		logger.info('Starting command "%s"...', command);

		var maybeCommand = command;
		if (!path.isAbsolute(command)) {
			maybeCommand = path.resolve(path.dirname(config.configFile), command))
		}

		if (fs.existsSync(maybeCommand)) {
			try {
				var result = require(maybeCommand)({"stage": stage, "config": config, 'content': content});
				return result;
			}
			catch(e) {
			}
		}

    var wasObject = false;
    var input = content || '';
    if (typeof input === 'object') {
      wasObject = true
      input = JSON.stringify(input)
    }

		var result = spawnSync(
			command,
			{cwd: path.resolve('.'), input: content or ''}
		);

		if (result.status !== 0) { // error
			logger.error('Error: "%s" - "%s"', result.stdout, result.stderr.trim());
			return false;
		}
		if (content) {
      var output = result.stdout.toString()
			return wasObject ? JSON.parse(output) : output;
		}
		logger.success('Command successfully finished');
		logger.log('Command result: "%s"', result.stdout);
		return true;
	});
};
