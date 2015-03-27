# Vegetables roadmap

## The future cool features and enhancements

### For now

This is my internal todo list, sorted by priority.  
If you think that some points are more important for you, let me know, I will change priorites. Or you can contribute.

- handle template partials
- sometimes, vegetables serve stops at startup with an error
- option: rename README.md to index.html (default: true)
- tag: sitemap (build a list of genereted files, images and linked files)
- tag: toc {label, anchor, level, entries: [...]}
- set .vegetables as a constant or a configuration variable (no... rmrf on a variable seems to be dangerous...)
- prevent from concurrent generation
- tag: if git versions the folder, get the release hash, tag and branch

### Later

- remote template checkout: if template is a GitHub address, clone it to .vegetables/git-template and change the internal variable to this path
- new command: ftp-deploy
- HTTP error pages?