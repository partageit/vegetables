# Vegetables changelog

## Vegetables 2.0.4

- new tag: `serveMode`, true when vegetables is started as `serve` mode.

## Vegetables 2.0.3

- ico format added to the media files
- When serving and the port is already in use, a more human-friendly message is displayed.

## Vegetables 2.0.2

- fixed: when no special pages were present, deploy was stopped.

## Vegetables 2.0.1

- the vegetables documentation template is updated to use reveal.js and the static search engine.
- fixed: special pages (e.g. search page) with common handlebars helpers (e.g. `active`), for example in partials, was not parsed.
- fixed: special layouts did not work since multiple folder indexes were allowed.

## Vegetables 2.0.0

- remark is now replaced with [reveal.js](http://lab.hakim.se/reveal-js/#/) for slideshow rendering. This enhancement leads to broken compatibility in customized templates.
- images are displayed responsively in template.
- new tag: `default` to get the first not null value between two.

## Vegetables 1.0.16

- tables style is enhanced in template.

## Vegetables 1.0.15

- new template tags: `slideshow.logoUrl`, `slideshow.logoPositionX` and `logoPositionY.logoPositionY`, to display a logo in slideshows.

## Vegetables 1.0.14

- folder index file is parsed from, in this order: `README.md`, `README.markdown`, `home.md` or `home.markdown`. This is useful when using [GitLab](https://about.gitlab.com/) wiki feature.

## Vegetables 1.0.13

- gollum partially compatible. For now: links without `.md` or `.markdown` are treated.

## Vegetables 1.0.12

- new tag: `toc`, to display a table of contents
- new tag: `truncate` to display a text summary
- default template enhanced to display summary in list pages
- new tags: `lt` and `gt`, to test lower or greater values in templates

## Vegetables 1.0.11

- fixed: `html-to-text` dependency was missing...

## Vegetables 1.0.10

- new `currentUri` for additional pages
- common handlebars helpers registered in a special file
- new handlebars helpers: `textize` and `json`, which translate to text and to JSON
- default template enhanced to allow searches, using [Tipue search](http://www.tipue.com)


## Vegetables 1.0.9

- fixed: `{{baseUri}}` did not work properly with the default template
- first implementation for additional pages, aka blog pages, such as site index, category and tags pages
- new handlebars helper: slugize, eq and neq
- default template enhanced to create site index and category/tags pages

## Vegetables 1.0.8

- handlebars replace the mustache render engine
- partial files handled, thanks to handlebars, with `partial-*.html` files in the template directory

## Vegetables 1.0.7

- configuration file: it is now possible to use wildcards in pageOptions documents name
- message added when the website is successfully deployed

## Vegetables 1.0.6

- layout support, e.g. layout-homepage.html, read from file tags or page options
- template - slideshow: transitions between slides enhanced
- assets files were not updated while serving

## Vegetables 1.0.5

- generation asynchronous process enhanced (and optimized) to be able to start the browser and live reload at the right moment

## Vegetables 1.0.4

- new options: scripts before and after to execute commands before and/or after generation
- serve mode: the Web site is automatically opened in browser
- live reload in preview mode, can be disabled in the configuration file

## Vegetables 1.0.3

- configuration: pageOptions available, i.e. customized tags par page
- template - slideshow: one-line code enhanced and transitions between slides
- frontmatter notation is supported, as yaml or json
- new CLI parameters: template, globaltitle, host and port
- configuration file supports YAML, with this priority: the file provided in CLI parameters < vegetables.yaml < vegetables.json

## Vegetables 1.0.2

- Non elegant logs removed
- Access address enhanced

## Vegetables 1.0.1

- svg format added to the media files
- default template enhancement: page title not displayed on small screens
- baseUri is now calculated as relative path

## Vegetables 1.0.0

First version, with:

- multiple formats template
- generate and serve features
- deploy on GitHub pages feature
- ...
