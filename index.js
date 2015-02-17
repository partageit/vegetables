#!/usr/bin/env node
//var path = require('path');
//var templateDir = __dirname + '/template';
var pkg = require('./package');
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
	'v': 'version',
})
.describe({
	//	'title': 'Generated Web site title',
	//	'template': 'Path to custom mustache template',
	// port, host, config, ...
	'help': 'This screen',
	'version': 'Display the... version'
})
.boolean('version')
.boolean('help')
.string('_');
//.default({
//	'config': 'vegetables.json' // should not begin with .
//});
var argv = yargs.argv;
if (argv.v) {
	console.log(pkg.name + ' v' + pkg.version);
} else if (argv.h) {
	//console.log(require('./lib/help')(yargs));
	console.log(yargs.help());
} else if (argv._[0] === 'serve') {
	require('./lib/serve')(argv);
} else if (argv._[0] === 'generate') {
	require('./lib/generate')(argv, true);
} else {
	console.log(yargs.help());
}
