#!/usr/bin/env node
var pkg = require('./package');
var logger = require('./lib/logger');

var yargs = require('yargs')
.usage(pkg.name + ' [options] <command>')  // pkg.name may be replaced with '$0'
.command('generate', 'Generate static Web pages from current folder Markdown documents')
.command('serve', 'Serve and watch the generated static Web pages')
.command('deploy', 'Generate pages and deploy it to your project GitHub pages')
.example(pkg.name + ' generate -t ../my-template', 'Use the provided template folder')
.example(pkg.name + ' serve -p 8989', 'Serve the static pages at http://localhost:8989')
.example(pkg.name + ' deploy', 'Generate pages and deploy it to your project GitHub pages')
.epilog(pkg.name + ' v' + pkg.version + ' - For more informations, check out our site: https://partageit.github.io/vegetables')
.alias({
	't': 'template',
	'h': 'help',
	'v': 'verbose',
	'p': 'port'
})
.describe({
	'globaltitle': 'Generated Web site title',
	'template': 'Path to the template',
	'host': 'Host for the serve command. Set to * to allow access from your local network',
	'port': 'Access port. Default: 8888',
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
} else if (argv._[0] === 'deploy') {
	require('./lib/deploy')(argv);
} else {
	console.log(yargs.help());
}
