# ashutoshgngwr.github.io

## License

Unless stated explicitly,

- all the files belonging to the works listed in the [**Third-party
  assets**](#third-party-assets) section, are covered by licenses provided in
  their respective repositories
- all the content in the [`_posts`](_posts) and [`_pages`](_pages) directories
   are covered by the [Creative Commons Attribution-ShareAlike 4.0 International
   License](http://creativecommons.org/licenses/by-sa/4.0/)
- all other source files in this repository are covered by the [GNU General
  Public License v3.0](LICENSE)

## Third-party assets

This Jekyll template/theme uses the following third-party assets.

- [asterisk icon](https://thenounproject.com/term/asterisk/379466) from the Noun
  Project
- [highlight.js](https://github.com/highlightjs/highlight.js)
- icons from [open-iconic](https://github.com/iconic/open-iconic)
- icons from [simple-icons](https://github.com/simple-icons/simple-icons)
- [jekyll-compress-html](https://github.com/penibelst/jekyll-compress-html)
- [Merriweather font](https://github.com/SorkinType/Merriweather)
- [normalize.css](https://github.com/necolas/normalize.css)
- [Source Code Pro font](https://github.com/adobe-fonts/source-code-pro)
- [Source Sans Pro font](https://github.com/adobe-fonts/source-sans-pro)

## Notes

### Layouts

- `post` layout is a child of the `page` layout. It contains additional mark-up
  to display metadata for entries in `_posts` collection.

- `error-page` layout is a child of the `page` layout for generating error
  pages. It accepts the following front matter data in addition to that accepted
  by the `page` layout.

  | Key     | Type     | Description                                         | Default |
  | ------- | -------- | --------------------------------------------------- | ------- |
  | `emoji` | `string` | An ASCII emoji to indicate the nature of the error. | `null`  |

- `page` is a shell layout for all pages with content. It accepts the following
  front matter data in addition to that accepted by the
  [`page-meta`](#miscellaneous) partial.

  | Key                | Type     | Description                                    | Default                       |
  | ------------------ | -------- | ---------------------------------------------- | ----------------------------- |
  | `in_nav_links`     | `bool`   | Include this page in the site navigation menu. | `false`                       |
  | `mathjax`          | `bool`   | Add MathJax JavaScript library to the page.    | `false`                       |
  | `in_sitemap`       | `bool`   | Include page in `/sitemap.xml`.                | `true`                        |
  | `sitemap_priority` | `number` | Priority of the page in site map (0-1).        | `collection.sitemap_priority` |

- `redirect` layout creates an HTML page redirect to the URL provided using the
  `href` key in the front matter.

  ```md
  ---
  layout: redirect
  href: https://github.com
  ---
  ```

- `compress` layout compresses HTML. **It does not process Javascript comments**
  so, single-line comments will result in syntax errors after compression. Use
  multiline comment syntax to avoid these errors. Use HTML comment format to
  remove the contents of a Javascript comment, e.g. `/* <!-- This is a comment.
  --> */` will output to `/* */`.

### Navigation Links

- **External navigation links** are present in
  [`_data/nav_links.yaml`](_data/nav_links.yaml).
- **Internal pages** from any collection should use `in_nav_links: true` front
  matter flag (default: `false`).

### Miscellaneous

- `_includes/page-meta.html` contains a generic template for adding metadata to
  HTML head in pages. A layout containing the `page-meta` partial will also
  accept the following front matter data.

  | Key       | Type     | Description                                                                            |        Default         |
  | --------- | -------- | -------------------------------------------------------------------------------------- | :--------------------: |
  | `title`   | `string` | Title of the page.                                                                     |           -            |
  | `excerpt` | `string` | Page excerpt (max: 20 words).                                                          | Jekyll's default value |
  | `image`   | `string` | Relative path of an image from `/assets/posts/img/` for Twitter & Open Graph previews. |      Site favicon      |
  | `tags`    | `string` | A comma-separated keyword list. Used with `_posts` collection.                         |         `null`         |

- The [`_pages`](_pages) collection **overrides** the default Jekyll `pages`
  collection (containing all rendered pages).

- Use `_icons` collection to inline SVGs in the `page` template. Make sure that
  each icon has valid front matter.

  ```md
  ---
  # empty front-matter
  ---
  <svg>...</svg>
  ```

  Then use `{% include icon.svg id='icon-name' %}` shorthand to display an
  inline icon, which essentially outputs the following.

  ```html
  <svg class="icon">
    <use xlink:href="#icon-name" />
  </svg>
  ```
