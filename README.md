# Vegetables

> A CLI tool to generate static web pages from Markdown documents.

## Todo

- tag: activeDocument
- tag: timestamp with local format
- use path.join instead of + '/' + +++
- parse links and images, directly in Markdown to add basedir
- when walking: copy images and html files
- configuration file: json and yaml
- review package.json
- rewrite this README.md
- if !./template use __dirname/template
- sitemap
- list of files/templates, images and linked files
- option: files to copy: jpeg,png,pdf,html,...
- option: scripts before and after
- option: port
- CLI parameters (template, port, ...) overided or overiding by vegetables.json
- baseUri in the template
- prevent from concurrent generation
- live reload (append socket.io in preview mode, can be disabled)
- set .vegetables as a constant or a configuration variable
- auto start in browser?
- option: rename README.md to index.html
- provide layout support, i.e. layout-homepage.html, read from file tags or pageOptions (priority?)
- tag: pageOptions
- parse HTML files links and images to add basedir



## Later:

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

### Options

```
--help, -h           This screen
```


## [License](LICENSE)