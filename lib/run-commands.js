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

	return commands.every(function(command) {
		logger.info('Starting command "%s"...', command);

		if (command instanceof Function) {
			return command({'stage': stage, 'config': config, 'content': content})
		}

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
	});
};
