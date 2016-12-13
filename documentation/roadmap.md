# Vegetables roadmap

## The future cool features and enhancements

### For now

This is my internal todo list, sorted by priority.  
If you think that some points are more important for you, let me know, I will change priorites. Or you can contribute.

- per-xxx-yyy.html where xxx should be a variable tag (e.g. for authors, types, ...)
- add pagination for list-based pages (e.g. category-yyy-z.html where z is the page number)
- more gollum compatibility, such as sequence diagrams and mathematics
- read list templates options (`listTemplatesOptions`) from configuration file, to set title, filename mask, pagination count, ...
- helper: move active helper (returns true if the URI is the current page's one) as common helper
- helper: page-only, change slideMarkdown from tag to helper
- add plugin manager, for markdown to slideshow, ..., maybe with https://www.npmjs.com/package/polite-plugin-manager
- slideshow content should be a handlebars helper, in order to call it only when required
- optimization: templates and partials should be cleaned only when the file date changes
- sometimes, vegetables serve stops at startup with an error (not seen since a while and many updates...)
- option: rename README.md to index.html (default: true)
- set .vegetables as a constant or a configuration variable (no... rmrf on a variable seems to be dangerous...)
- prevent from concurrent generation
- tag: if git versions the folder, get the release hash, tag and branch

### Later

- remote template checkout: if template is a GitHub address, clone it to .vegetables/git-template and change the internal variable to this path
- new command: ftp-deploy
- HTTP error pages?
