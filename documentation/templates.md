# Templates

## What is a template?

Templates are HTML files including CSS and JavaScript, with [Handlebars](http://handlebarsjs.com/) tags.

As Handlebars is quite simple, writing templates is really easy.

If you don't know [Handlebars](http://handlebarsjs.com/), you should read the documentation, as it is the base of Vegetables template writing.

A template is used as a frame to include your content. And you can create your own frames!

## How?

### Get started

The first thing to do is to create a new template folder, wherever you want.

To start, a good way to develop a new template is to put it in the documents folder, in order to take advantage of automatic regeneration feature of the preview mode when it is modified.

Clearly, create a new folder named `template` in your Markdown documents folder, type `vegetables serve`, open your Web browser, update the template, refresh in your browser, and continue.

### Define a different path

It is possible to provide a template path in the CLI parameters, or in the configuration file.

When the template path is not provided, the `template` folder in the Markdown documents folder is used.

If it does not exist, the default template provided with Vegetables is used.

## Template files

### Default template

The default template must be named `template.html`.

It contains whatever your want.

A basic example:

```html
<html>
	<head>
		<title>{{title}} - {{globalTitle}}</title>
	</head>
	<body>
		<!-- page title -->
		<h1>{{{globalTitle}}} - {{{title}}}</h1>

		<!-- menu -->
		<ul>
			{{#menu}}
			<li><a href="{{{../baseUri}}}{{uri}}">{{label}}</a></li>
			{{/menu}}
		</ul>

		<!-- the content transformed as HTML -->
		{{{content}}}

		<!-- enable the auto reload feature -->
		{{{autoReload}}}

	</body>
</html>
```

This template is simple, it provides the minimum HTML to display a Web page.

### Some explanations

This template contains some Handlebars tags:

- `{{title}} - {{globalTitle}}` in the `<title>` to display the page title
- nearly the same as `<h1>`
- the `<ul>` part displays a menu, with the `menu` tag. The starting `#` of `{{#menu}}` means that a loop must be performed on this list
- the Markdown content transformed as HTML is inserted thanks to `{{{content}}}`

Of course, you can add CSS, JavaScript, pictures, ...

The generated file name is the Markdown document name, with the extension changed as `.html`.
For example, `my-document.md` is transformed as `my-document.html` in the generation folder.  
By default, `README.md` (and `home.md`) is renamed as `index.html`.

### Other formats

You can define many formats for the same Markdown documents, for example an HTML page, a slideshow, ...

To add a format, simply add a new template file, like the default one, and name it: `template-<format name>.html`, for example: `template-slideshow.html`.

The syntax is exactly the same as for the default template.

Generated files name contains the format name, for example `my-document.md` becomes `my-document-slideshow.html`.

### Layouts

For each Markdown document, it is possible to define a layout, i.e. a specific template, with its own style and its own formats.

To add a layout, create a new file, with exactly the same method as the template file, but with a specific name: `layout-<the layout name>.html`.

For example: `layout-homepage.html`.

Then, to use this layout, declare it to the concerned Markdown documents, like explained in the [configuration page](configuration.md).

Like with the default template, it is possible to create many formats for layouts, for example, a slideshow specific to the homepage: `layout-homepage-slideshow.html`.

### Assets

Of course, you can add JavaScript and CSS files to enhance the content rendering.

In this case, you should add the `baseUri` tag to prevent from problems when accessing from a sub folder.

```html
<link rel="stylesheet" href="{{{baseUri}}}assets/css/main.css">
```

For example, when `folder1/my-document.md` is transformed as `folder1/my-document.html`, this line is automatically translated as:

```html
<link rel="stylesheet" href="../assets/css/main.css">
```

Local assets, i.e. pictures, CSS and JavaScript files, **must be located** in the `assets` folder in the template folder.

This `assets` folder is fully copied in the generated Web site folder.

## Template development best practices

### Standard tags

Some tags should be standard in templates, for example: `globalTitle` and `menu` which should be at least a list of {uri, label}:

```javascript
"menu": [
	{
		"uri": "page.html",
		"label": "Page"
	},
	...
]
```

### Use base URI for static resources

The `{{{baseUri}}}` Handlebars tag should be added to access static content, like assets, or generated pages.

## Tags

### Tags from configuration

Remember that tags added in the `tags` section of the [configuration file](configuration.md) and in the [Markdown documents](write-documents.md) can be displayed in the templates.

So, feel free to add as many as you need.

For example, if you need another menu, you can create a new tag `menu2` or `subMenu` which contains a list of objects, like the first menu.

### Other tags

Vegetables provides many other tags.

- `content`: the Markdown content as HTML
- `markdown`: the raw Markdown content
- `slideMarkdown`: the Markdown content, rewritten to be displayed as slideshow with reveal.js
- `baseUri`: the relative base path to access to the root of the documentation (it is empty, or it contains `../` or `../../` according to the document path level)
- `timestamp`: the generation date/time in the local format
- `format`: the template format name used for the current generated HTML file, e.g. `default` or `slideshow`
- `autoReload`: enable the automatic reload when changes are done on the document. The Handlebars tag is replaced only in serve mode, it remains empty when it is deployed as GitHub pages for example.
- `document`: the Markdown document name with relative path, for example `folder1/my-document.md`
- `currentUri`: the current HTML file URI, e.g. `folder1/my-document.html` or `folder1/my-document-slideshow.html`
- `toc`: list of headings, as `{title, level, anchor}`, in order to display a table of contents
- `versions`: available format versions of the current document, as a list of `{format, uri}`. For example:

```javascript
[
	{
		"format": "default",
		"uri": "folder1/my-document.html"
	},
	{
		"format": "slideshow",
		"uri": "folder1/my-document-slideshow.html"
	}
]
```

So you can add a version marker as comment in your template, for example:

```html
<!-- Generated by Vegetables from '{{{document}}}' with format '{{format}}' - '{{timestamp}}' -->
```

Will display:

```
Generated by Vegetables from 'folder1/my-document.md' with format 'default' - 'Wed Feb 25 2015 14:39:13 GMT+0100 (Romance Standard Time)'
```
## Snippets

Functional tags are also provided, here are some snippets to show how to use it.

### Link to the slideshow page of the current document

```html
<a href="{{{baseUri}}}{{uriByVersion 'slideshow'}}">
	View as slideshow
</a>
```

### Add active class to the current page on a link

```html
<ul>
	{{#menu}}
	<li class="{{active uri}}">
		<a href="{{{../baseUri}}}{{uri}}">{{label}}</a>
	</li>
	{{/menu}}
</ul>
```

`{{active uri}}` displays `active` if the menu URI in the loop is the same as the current page URI.


### Add active class to the current document on a link

```html
<ul>
	{{#menu}}
	<li class="{{activeDocument document}}">
		<a href="{{{../baseUri}}}{{uri}}">{{label}}</a>
	</li>
	{{/menu}}
</ul>
```

The difference with the previous snippet: the link is active, whatever the current format is.

### Add a menu to link every available formats

```html
<ul>
	{{#versions}}
	<li>
		<a href="{{uriByVersion format}}">{{format}}</a>
	</li>
	{{/versions}}
</ul>
```

### Table of contents

This snippet displays titles with level lower than 4 (i.e. 1 to 3), each level is indented thanks to the `toc-x` class:

```html
<div>
	<p>Table of contents:</p>
	{{#toc}}
		{{#lt depth 4}}
		<p class="toc-{{depth}}">
			<a href="#{{anchor}}">{{title}}</a>
		</p>
		{{/lt}}
	{{/toc}}
</div>
```

With this CSS:

```css
.toc-2 { margin-left: 2rem; }
.toc-3 { margin-left: 4rem; }
```

## Partials

For recurrent parts of your Web site, such as menu or headers, create a new file named `partial-<partial name>.html` where `<partial name>` is the name of the part.

For example, in the case of a footer, create the file `partial-footer.html`, with this content:

```html
<p>Visit our Web site</p>
<p>Follow us on Twitter</p>
<p>...</p>
```

The partial is registered as Handlebars partial, as `footer`.

To include it in a template, use the Handlebars syntax:

```html
<footer>
	{{> footer}}
</footer>
```

## Coming soon

Coming features:

- Get template from Git or GitHub
