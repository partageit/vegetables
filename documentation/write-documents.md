# Write documents

The philosophy of Vegetables is to write documents as if it was your notes, i.e. structured logically to make it easy to read.

Clearly : you only have to [write Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)...

## The title

Vegetables is able to guess the document title: the first header is read.

```markdown
# This is my document title

## A subtitle

Some content
```

Here, the document title is `This is my document title`.

If no headers are present, the document file base name is used, for example `my-document` if the Markdown file name is `my-document.md`.

As the template point of view, it is the `title` tag.

## Add metadata per page

However, it is possible to add document metadata in order to sort documents easily or to display additional informations.

Note that the metadata are read with this **order of importance**:

Configuration file common tags < Configuration file page option tags < Frontmatter tags < reference tags

Clearly, when it is defined, reference tags always win.

### The reference way

This method is simple: use the Markdown references to add simple data.

For example, to change the default title, simply write, wherever you want:

```markdown
[tag-title]: - (My Web page title)
```

The format is simple: between square brackets: `tag-` followed by the tag name, and between parenthesis: the value.

As this syntax is recognized by Markdown as a reference, it is not displayed when transformed to HTML.

It is possible to define any text metadata with this method, for example the Web site title (`globalTitle`):

```markdown
[tag-globalTitle]: - (The global Web site title)
```

### The Frontmatter way

If you need to define more complex tag values, it is possible with Frontmatter. A simple example:

```markdown
---
title: My Web page title
---
# Welcome!

Some content
```

Simply, put Yaml between `---` and `---`. It must be the first line of the Markdown document.

It is also possible to define a specific menu, or complex metadata:

```markdown
---
title: My Web page title
menu:
  - uri: Category Homepage
    label: category/index.html
  - uri: Other page
    label: category/other-page.html
---
# Welcome!

Some content
```

This is the Yaml notation, but it is also possible to write Frontmatter as JSON:


```markdown
---
{
	"title": "My Web page title",
	"menu": [
		{
			"uri": "Category Homepage",
    	"label": "category/index.html"
		},
		{
			"uri": "Other page",
    	"label": "category/other-page.html"
		}
	]
}
---
# Welcome!

Some content
```

### The configuration file way

Remember that it is also possible to [define page options directly in the configuration file](configuration.md) under the `pageOptions` parameter.

So it is still not mandatory to add metadata in your Markdown files.