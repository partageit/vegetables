# Configure Vegetables

## Where?

Vegetables is able to start without any configuration.

However you surely want to customize parameters, such as the Web site title.

So, the first thing to do is adding a new file in the Markdown documents folder, named `vegetables.json`.

For example:

```json
{
	"template": "my-customize-template",
	"tags": {
		"globalTitle": "My Web site",
		"menu": [
			{
				"uri": "index.html",
				"label": "Homepage"
			},
			{
				"uri": "another-page.html",
				"label": "Another page"
			}
		]
	}
}
```

## Global parameters

### Template

By default, the template included with Vegetables is used, or if you have a `template` folder in your Markdown documents folder, it is automatically taken into account.

Otherwise, the `template` parameter is made for you:

```json
{
	"template": "path/of/the/template"
}
```

### Host and port

This is preview mode host and port, i.e. the ones to access the preview version of your Web site after typing `vegetables serve`.

If you want to give access to the preview version of your Web site, set the host to `*`.  
Otherwise, no one, except you, will be able to connect to it.

```json
{
	"host": "*",
	"port": 8123
}
```

The default port is `8888`, so you can view your Web site at `http://localhost:8888`.


### Additional media

During the generation, the structure of your documentation folder is copied, to create the HTML version of the Markdown documents.

Moreover, media files are copied: `jpg` (and `jpeg`), `png`, `gif` and `html`.

You can add file formats to this list with `additionalMedia`:

```json
{
	"additionalMedia": ['pdf', 'avi']
}
```

Here, all the formats listed above, plus `pdf` and `avi` files are copied.

It is also possible to replace the default format list with the `media` parameter:

```json
{
	"media": ['htm', 'html', 'pdf']
}
```

Here, only `html` and `pdf` files are copied.


## Tags parameters

Tags parameters are parameters passed directly to the template, in order to display it using the Mustache syntax.

Knowing that, if you [make your own templates](templates.md), this is a direct gate to transmit global data.

For example, a common tag is `globalTitle`, i.e. the generated Web site title, to display near the page title.

Tags value are not only strings: another tag, shown in the example above, is the `menu` tag, which is a list of objects, containing the data for each page in the menu.  
The default template only needs the `uri` and the `label`, but it may accept, according to your template, an icon name or a sub title to display under/near the label.

### Global title

This is the Web site title, it can be, for example, added near the page title in the `<title>` HTML tag.

### Menu

This is the menu, as a list of objects:

```json
{
	"tags": {
		"menu": [
			{
				"uri": "index.html",
				"label": "Homepage"
			},
			{
				"uri": "another-page.html",
				"label": "Another page"
			},
			{
				"uri": "https://github.io",
				"label": "GitHub"
			}
		]
	}
}
```

The `uri` may be absolute, to link another Web site, or relative, to link an internal page.

## CLI parameters

Some parameters can be provided directly in the command line, when starting Vegetables, for example:

    vegetables serve --port 8123 --host *

Or:

    vegetables generate --template ~/my-template

To know which parameter are availalbe, use the CLI help command:

    vegetables --help