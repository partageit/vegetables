# Vegetables

> A CLI tool to generate static web pages from Markdown documents.

## Todo

- review package.json
- rewrite this README.md
- use path.join instead of + '/' + +++
- parse links and images, directly in Markdown
- when walking: copy images and html files
+ files are not regenerated after modifying templates
- provide layout support, i.e. layout-homepage.html
- copy template/assets to .vegetables
- if !./template use __dirname/template
- Later: remote template checkout
- if git versions the folder, get the release hash and set as tag
- set title according to title mode
+ highlight text in HTML mode
- live reload
- sitemap
- list of files/templates, images and linked files
- tag: availableVersions, to loop in mustache
- option: files to copy: jpeg,png,pdf,html,...
- option: port
- CLI parameters (template, port, ...) overided or overiding by vegetables.json
+ watch template, current dir, not .vegetables
- baseUri in the template
- prevent from concurrent generation
- append socket.io in preview mode, can be disabled
+ generate(init): if init, remove .vegetables
- set .vegetables as a constant or a configuration variable
- list files in walk and start compile in another loop
- auto start in browser?
- mustache lambda do not work. Try with this engine: https://github.com/janl/mustache.js


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