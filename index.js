#!/usr/bin/env node
var pkg = require('./package');
var logger = require('./lib/logger');

var yargs = require('yargs')
.usage(pkg.name + ' [options] <command>')  // pkg.name may be replaced with '$0'
.command('generate', 'Generate static Web pages from current folder Markdown documents')
.command('serve', 'Serve and watch the generated static Web pages')
.example(pkg.name + ' generate -t ../my-template', 'Use the provided template folder')
.example(pkg.name + ' serve -p 8989', 'Serve the static pages at http://localhost:8989')
.epilog(pkg.name + ' v' + pkg.version + ' - For more informations, check out our site: http://???')
.alias({
	//	't': 'template',
	'h': 'help',
	'v': 'verbose',
})
.describe({
	//	'title': 'Generated Web site title',
	//	'template': 'Path to custom mustache template',
	// port, host, config, ...
	'help': 'This screen',
	'version': 'Display the... version',
	'verbose': 'Enable verbose mode',
	'silent': 'Disable every outputs',
	'config': 'Configuration file. If not set, and if present, vegetables.json is used.'
})
.boolean('version')
.boolean('help')
.boolean('silent')
.count('verbose')
.string('_')
.string('config')
.default({
	'config': '' // should not begin with .
});
var argv = yargs.argv;
logger.init(argv.silent ? -1 : argv.verbose);

if (argv.version) {
	console.log(pkg.name + ' v' + pkg.version);
} else if (argv.h) {

	console.log(yargs.help());
} else if (argv._[0] === 'serve') {
	require('./lib/serve')(argv);
} else if (argv._[0] === 'generate') {
	require('./lib/generate')(argv, true);
	logger.success('Finished!');
} else {
	console.log(yargs.help());
}
