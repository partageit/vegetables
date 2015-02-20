# Vegetables

> A CLI tool to generate static Web pages from Markdown documents.

## Note

As Vegetables generates static Web pages for documentation, be sure that it will own its GitHub page soon, to complete this document.

## Write Markdown, generate web pages

## Preview mode and files watching

## Web pages and slides

It is possible to create many templates for the same page, for example an HTML document and a slideshow based on remark.js.

## Installation

    $ npm install vegetables -g

## Usage

### Basic usage

In your Markdown documents folder, type:

    $ vegetables serve

Markdown files are transformed as HTML files, keeping the folders structure, and can be viewed at http://localhost:8888.

### Configuration

The json file:

- title
- subtitle
- template
- exclude = [folders and files to exclude]
- menu
 - name: {path,anchor,slideshow:[none, normal, document-mode]}

- host: read only at startup, by default: localhost, to accept connections from any `*`
- port: read only at startup, by default: 8888

### Options

```
--help, -h           This screen
```

## Tags

Tags are used in the template files, to render content associated to a page.

Some tags are predefined, and it is possible to define you own tags, globally and per document.

### Predefined tags

The list:

- ...

### Customized global tags

In the configuration file

### Customized per-document tags

In each Markdown document, with the reference syntax, value as the title, tag name and reference name prefixed with `tag-`. For example:

    [tag-title] - (The page title)

Overwrite the page title.

As it is a reference, it is never displayed in the generated HTML document.



## [License](LICENSE)

## Todo

This is my internal todo list, sorted by priority.  
If you think that some points are more important for you, let me know, I will change priorites. Or you can contribute.

- check renderers result
- parse in-document tags as JSON
- support frontmatter notation (as JSON)
- option: scripts before and after
- option: rename README.md to index.html (default: true)
- Some CLI parameters (template, site title, ...) should overide vegetables.json and default configuration values
- prevent from concurrent generation
- live reload in preview mode (with socket.io?, can be disabled)
- auto start in browser?
- provide layout support, i.e. layout-homepage.html, read from file tags or pageOptions (priority?)
- tag: pageOptions
- handle template partials (with mustache or internally?)
- parse HTML files links and images to add basedir?
- tag: sitemap (build a list of genereted files, images and linked files)
- tag: toc {label, anchor, level, entries: [...]}
- set .vegetables as a constant or a configuration variable (no... rmrf on a variable seems to be dangerous...)
- extract the marked renderer to Markdown as a library
- HTTP error page?

### Later

- if git versions the folder, get the release hash and set as tag
- remote template checkout: if template is a GitHub address, clone it to .vegetables/git-template and change the internal variable to this path
- new command: ftp-deploy