# Getting started

## Install Vegetables

Vegetables is available on NPM.

If it is not already done, install [NodeJS from the official Web site](http://nodejs.org/) and type this command:

    npm install vegetables -g

## Preview your documents

Go to the folder containing your Markdown documents and type:

    vegetables serve

It it is not automatically opened in your default browser, go to `http://localhost:8888` and view the result.

Note: if no `README.md` are available, type the document name, followed by `.html` (for example `document.md` is available at `http://localhost:8888/document.html`).

The folder structure is also copied, so `folder/document.md` is available at `http://localhost:8888/folder/document.html`.

## Customize

You can change the title and add a menu creating a [Vegetables configuration file](configuration.md): `vegetables.json`, containing:

```json
{
	"tags": {
		"globalTitle": "My Web site",
		"menu": [
			{
				"uri": "index.html",
				"label": "Homepage"
			},
			{
				"uri": "another-page.html",
				"label": "Another page"
			}
		]
	}
}
```

Note that the configuration file can be `vegetables.yml`, written with the YAML syntax.

If you want, you can create your own [template](templates.md).

## Generate your Web site

Once your documents are written, you can generate the pages to copy on your Web server, typing:

    vegetables generate

The result is in the document repository, in `.vegetables/website/`, ready to burn on a CD-R 4x if you live in the 90's.

Note: if the folder is versioned with Git, add `.vegetables` to the `.gitignore` file.

## Deploy on GitHub pages

If the documentation is part of a project on GitHub, simply type:

    vegetables deploy

This will generate the Web pages and commit it as [GitHub pages](https://pages.github.com/), i.e. it will be available at `https://your-github-login.github.io/your-project/`.

Of course, your GitHub project will remain unchanged, only the `gh-pages` changes.