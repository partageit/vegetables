# Vegetables roadmap

## The future cool features and enhancements

### For now

This is my internal todo list, sorted by priority.  
If you think that some points are more important for you, let me know, I will change priorites. Or you can contribute.

- support frontmatter notation (as yaml or json): https://github.com/nodeca/js-yaml
- support vegetables.yaml, with this priority: the file provided in CLI parameters -> vegetables.yaml -> vegetables.json
+ configuration: pageOptions (customized tags par page)
- Some CLI parameters (template, site title, ...) should overide vegetables.json and default configuration values
- option: scripts before and after
- option: rename README.md to index.html (default: true)
- prevent from concurrent generation
- live reload in preview mode (with socket.io, can be disabled)
- auto start in browser?
- provide layout support, i.e. layout-homepage.html, read from file tags or pageOptions (priority?)
- handle template partials (with mustache or internally?)
- parse HTML files links and images to add basedir?
- tag: sitemap (build a list of genereted files, images and linked files)
- tag: toc {label, anchor, level, entries: [...]}
- set .vegetables as a constant or a configuration variable (no... rmrf on a variable seems to be dangerous...)
- tag: if git versions the folder, get the release hash, tag and branch

### Later

- remote template checkout: if template is a GitHub address, clone it to .vegetables/git-template and change the internal variable to this path
- new command: ftp-deploy
- HTTP error pages?