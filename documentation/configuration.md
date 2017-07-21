# Configure Vegetables

## Where?

Vegetables is able to start without any configuration.

However you surely want to customize parameters, such as the Web site title.

So, the first thing to do is adding a new file in the Markdown documents folder, named `vegetables.json` or `vegetables.yml`.

Yes, Vegetables supports both JSON and YAML.

An example with JSON:

```json
{
	"template": "my-customize-template-folder",
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

The same, with YAML:

```yaml
template: my-customize-template-folder
tags:
 globalTitle: My Web site
 menu:
  - uri: index.html
    label: Homepage
  - uri: another-page.html
    label: Another page
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

Moreover, media files are copied: `jpg` (and `jpeg`), `png`, `gif`, `ico`, `svg` and `html`.

You can add file formats to this list with `additionalMedia`:

```json
{
	"additionalMedia": ["pdf", "avi"]
}
```

Here, all the formats listed above, plus `pdf` and `avi` files are copied.

It is also possible to replace the default format list with the `media` parameter:

```json
{
	"media": ["htm", "html", "pdf"]
}
```

Here, only `html` and `pdf` files are copied.

### Before and after scripts

It is possible to start action before and after Web pages are generated.

For example, to start a command before:

```json
{
	"before": "cp .htaccess .vegetables/websites"
}
```

Commands are **always started from the documents folder**.

It is also possible to start many commands, including it in an array:

```json
{
	"before": [
		"cp .htaccess .vegetables/websites",
		"cp robots.txt .vegetables/websites"
	],
	"after": "echo Finished!"
}
```

### Auto open

Right after starting Vegetables with the `serve` option, the homepage is automatically started in your favorite browser.

If you want to disable this feature, simply set `serveAutoOpen` to false in the configuration file.


### Auto reload

When you are writing Markdown with the serve mode enabled (i.e. you started Vegetables with `vegetables serve`), the content in your browser is automatically refreshed when changes happen.

You can disable this feature, setting `serveAutoReload` to false in the configuration file.

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

### Slideshow options

These tags help to configure slideshows display.

```yaml
tags:
 slideshow:
   logoUrl: /mylogo.png
   logoPositionX: left
   logoPositionY: bottom
   autoSlide: 5000
   loop: true
   transition: zoom
   headingLevel: 4
```

- `logoUrl`: the path to the logo. It can be present locally or on another Web site. If not set, nothing is displayed.
- `logoPositionX`: the horizontal position. Possible values are `left`, `right` or any values in percents or pixels (e.g. `200px` or `50%`). Default value: `left`.
- `logoPositionY`: the vertical position. Possible values are `top` or `bottom`.Default value: `bottom`.
- `headingLevel`: by default, slides with level 1 and 2 heading (i.e. with `#` and `##`) are displayed horizontally. Level 3 are displayed vertically. When settings `headingLevel: 4`, level 4 slides are also displayed vertically.
- `theme`: the reveal.js theme, [many are available](https://github.com/hakimel/reveal.js/tree/master/css/theme).
- `autoSlide`: enable automatic progress and set duration in milliseconds. `0` to disable.
- `loop`: loop the slideshow when `true`.
- `showNotes`: display notes in slides, instead of showing it in the speaker view only (press `s` to display speaker view). Notes are prefixed with `Presentation note:`.
- `transition`: transition type. By default: `slide`. Possible values: `none`, `fade`, `slide`, `convex`, `concave` or `zoom`.

Remember that [options can be set for each document using frontmatter](write-documents.md).

## Page options tags

It is possible to define tags per page, directly in the configuration file.

For example:

```json
{
	"pageOptions": {
		"README.md": {
			"title": "Homepage"
		}
	}
}
```

This means that the title of pages generated from `README.md` will be replaced with `Homepage`.

Take a look at the [documents writing documentation page](write-documents.md) for further details about the title page.

### Wildcards

In the configuration file, the `pageOptions` document names can contain wildcards, i.e. `*` and `?`.

An example, with YAML:

```yaml
pageOptions:
 - README.md:
  title: Welcome to my site
 - documentation/README.md
  title: This is the documentaion homepage
 - documentation/*
  title: A documentation page
```

Here, the homepage title is `Welcome to my site`, the documentation homepage is `This is the documentaion homepage` and other pages in the `documentation` folder have the same title: `A documentation page`.

When a document matches with many wildcards, properties are merged, with this rules:

- properties of fully qualified document names have the greater priority, they are always kept
- the last defined properties has the greater priority.

For example:

```yaml
pageOptions:
 - documentation/intro-config-part1.md
   title: First part of configuration
 - documentation/*
   title: A documentation page
   menu:
    - uri: index.html
      label: Homepage
    - uri: documentation/index.html
      label: Documentation
    - uri: documentation/intro-config-part1.html
      label: Introduction
 - documentation/intro*
  title: Introduction
```

Here, `documentation/intro-config-part1.html` has its own title, every pages in `documentation` starting with `intro` have another title and other pages in `documentation` have a third title.

Moreover, every pages in `documentation` have a customized menu.

### Layouts

If the template you use provides many layouts, i.e. different page templates, you can define it using the `layout` parameter, in the page options tags (or directly [in the Markdown document](write-documents.md)).

For example, with YAML:

```yaml
pageOptions:
 - README.md:
  title: Welcome to my site
  layout: homepage
```

## CLI parameters

Some parameters can be provided directly in the command line, when starting Vegetables, for example:

    vegetables serve --port 8123 --host *

Or:

    vegetables generate --template="~/my-template"

Or:

    vegetables deploy --globaltitle="My GitHub pages"

To know which parameters are available, use the CLI help command:

    vegetables --help
