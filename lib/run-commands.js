spawnSync = require('child_process').execSync;
logger = require('./logger')
path = require('path')
fs = require('fs')

// Function to start before and after commands
module.exports = function(config, stage, content) {
	commands = config[stage] || config['hooks'];

	if (!commands || (commands.length === 0)) {
    return content ? content : true;
	}
	if (typeof commands === 'string') {
		commands = [commands];
	}

	return commands.reduce(function(content, command) {

		if (typeof command === 'object') {
			logger.info('Running hook (%s) from %s...', stage, command.hookFile);
			return command.hookFunction({'stage': stage, 'config': config, 'content': content})
		}

		logger.info('Starting command (%s) "%s" ...', stage, command);

    var wasObject = false;
    var input = content || '';
    if (typeof input === 'object') {
      wasObject = true
      input = JSON.stringify(input)
    }

		var result = spawnSync(
			command,
			{cwd: path.resolve('.'), input: content || ''}
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
	}, content);
};
