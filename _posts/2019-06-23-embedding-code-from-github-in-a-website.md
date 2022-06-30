---
layout: post
title: "Embedding code from GitHub in your website"
date: 2019-06-23 17:12:00 +0530
tags: javascript embed-code jekyll github-pages
image: embedding-code-from-github-0.jpg
redirect_from: /2019/06/23/embedding-code-from-github-in-a-website
---

I've spent the past few days redesigning my website which is built using
[Jekyll][jekyll] and [GitHub pages][github-pages]. In my [last post][last-post],
I had to embed code samples from one of my repositories and things got a little
messy there due to lack of any usable plugins.

[Jekyll][jekyll] is a static site generator that takes content written in
[Markdown][markdown] format, processes it, and generates corresponding HTML
files using defined template files.

My end goal here was to be able to embed code samples from a GitHub
repository to my posts without a hassle. Before continuing, I should let you
know that [Markdown][markdown] engines _generally_ allow writing plain HTML
which is left untouched as the content is injected into HTML templates. As a
result, injected plain HTML is also processed by browsers like the rest of it.

At first, I was looking for a quick solution and found [Gist-it][gist-it] which
was exactly what I needed. It's a great tool but using it meant that I had less
control over syntax highlighting and CSS styling of the rendered code. To insert
code using [Gist-it][gist-it], I needed to add the following HTML code to my
post, which imports a server-rendered Javascript in the page. _A script for
every block of code? Feels dirty!_

```html
<script src="https://gist-it.appspot.com/github/robertkrimen/gist-it-example/blob/master/example.js"></script>
```

The above code in a post would end up looking like this (_so much for eye
candy_)

![gist-it preview](/assets/posts/img/embedding-code-from-github-1.jpg)

## Getting my hands dirty

This ~~morning~~ afternoon, I woke up and started working on a JavaScript
solution that I could insert in the page templates so that it is loaded only
once. Given the simplicity of the task, I had no problem breaking it down to the
primitives. I began writing code from an end user's perspective, so I started
with the bit that I would need to insert code in my posts. It had to be written
in HTML because [Markdown][markdown] syntax is pretty basic and doesn't do much
except text formatting. I came up with the following

```html
<pre data-start="29" data-end="33" data-lang="yaml"
  data-src="https://raw.githubusercontent.com/trynoice/android-app/0.2.1/.travis.yml"
  data-view="https://github.com/trynoice/android-app/blob/0.2.1/.travis.yml#L29-L33"
></pre>
```

- **`data-start`:** Line at which code embedding will start
- **`data-end`:** Line at which code embedding will end
- **`data-lang`:** Hints language in which the embedded code is written
- **`data-src`:** URL of the file using which it can be downloaded
- **`data-view`:** Alternate URL to view the file, e.g. GitHub blob link

### The actual magic boxes

Next step was to write some JavaScript that would perform some weird wizardry to
put some actual code in the `<pre>` elements. I used the following logical steps
to make that happen.

- Find all `<pre>` elements in the page that have the `data-src` attribute
- For each of those elements
  - Download the code from the URL in the `data-url` attribute
  - Slice up the downloaded code from the `data-start` to the `data-end` position
  - Create a `<code>` element with the sliced up code in it
  - Insert the newly created `<code>` element into the existing `<pre>` element
  - Highlight syntax using the language provided using the `data-lang`
    attribute. I am using ~~[PrismJS][prismjs]~~ [highlight.js][hljs] for syntax
    highlighting. It is modular and configurable with massive support for
    various languages.
  - Add a link next to the `<pre>` element to view the actual file

### The code

<pre data-start="190" data-end="217" data-lang="javascript"
  data-src="https://raw.githubusercontent.com/ashutoshgngwr/ashutoshgngwr.github.io/edeeb73916d5332a930b3314d727cd389ef5e958/_includes/scripts.html"
  data-view="https://github.com/ashutoshgngwr/ashutoshgngwr.github.io/blob/edeeb73916d5332a930b3314d727cd389ef5e958/_includes/scripts.html#L190-L217"
></pre>

<pre data-start="150" data-end="158" data-lang="javascript"
  data-src="https://raw.githubusercontent.com/ashutoshgngwr/ashutoshgngwr.github.io/edeeb73916d5332a930b3314d727cd389ef5e958/_includes/scripts.html"
  data-view="https://github.com/ashutoshgngwr/ashutoshgngwr.github.io/blob/edeeb73916d5332a930b3314d727cd389ef5e958/_includes/scripts.html#L150-L158"
></pre>

<pre data-start="128" data-end="148" data-lang="javascript"
  data-src="https://raw.githubusercontent.com/ashutoshgngwr/ashutoshgngwr.github.io/edeeb73916d5332a930b3314d727cd389ef5e958/_includes/scripts.html"
  data-view="https://github.com/ashutoshgngwr/ashutoshgngwr.github.io/blob/edeeb73916d5332a930b3314d727cd389ef5e958/_includes/scripts.html#L128-L148"
></pre>

<pre data-start="160" data-end="169" data-lang="javascript"
  data-src="https://raw.githubusercontent.com/ashutoshgngwr/ashutoshgngwr.github.io/edeeb73916d5332a930b3314d727cd389ef5e958/_includes/scripts.html"
  data-view="https://github.com/ashutoshgngwr/ashutoshgngwr.github.io/blob/edeeb73916d5332a930b3314d727cd389ef5e958/_includes/scripts.html#L160-169"
></pre>

[jekyll]: https://jekyllrb.com/
[github-pages]: https://pages.github.com/
[last-post]: /2019/06/21/continuos-integration-and-delivery-for-android-apps
[markdown]: https://en.wikipedia.org/wiki/Markdown
[gist-it]: https://gist-it.appspot.com/
[prismjs]: http://prismjs.com/
[hljs]: https://highlightjs.org/
