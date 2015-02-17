# Vegetables

> A CLI tool to generate static web pages from Markdown documents.

## Todo

- review package.json
- rewrite this README.md
- check renderers result
- support frontmatter notation
- parse in-document tags as JSON
- if !./template use __dirname/template
- sitemap
- list of files/templates, images and linked files
- option: scripts before and after
- CLI parameters (template, port, host, config file, ...) overided or overiding by vegetables.json
- prevent from concurrent generation
- live reload (append socket.io in preview mode, can be disabled)
- set .vegetables as a constant or a configuration variable
- auto start in browser?
- option: rename README.md to index.html
- provide layout support, i.e. layout-homepage.html, read from file tags or pageOptions (priority?)
- tag: pageOptions
- parse HTML files links and images to add basedir
- tag: toc {label, anchor, level, entries: [...]}
- extract the marked renderer as a library

### Later

- if git versions the folder, get the release hash and set as tag
- remote template checkout
- deploy command
- handle template partials (with mustache or internally?)


## Write Markdown, generate web pages

## Preview mode and files watching

## Web pages and slides

Document mode or not.

## Installation

    $ npm install vegetables -g

## Usage

### Basic usage

In your Markdown documents folder, type:

    $ vegetables serve

Markdown files are transformed as HTML files, keeping the folders structure, and can be viewed at http://localhost:8888.

### Configuration

The json file:

- title-mode: read from the current Markdown document or hardcoded below
- title
- subtitle
- template
- document-mode
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