---
layout: compress
---
/* <!-- register service worker --> */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js", { scope: "/" })
    .catch(function (error) {
      console.log("Service worker failed to register!", error);
    });
}

/* <!--
  defines a function for toggling between the bright/dark theme variants. Also
  sets bright/dark theme on the page load.
--> */
let KEY_THEME = "data-theme";
let THEME_DARK = "dark";
let THEME_BRIGHT = "bright";
let PREFERS_DARK_SCHEME_MQ = "(prefers-color-scheme: dark)";
let ACTIVE_THEME_REQUEST = "active-theme-request";
let themeChannel = new BroadcastChannel(KEY_THEME);

function setTheme(theme) {
  if (theme !== THEME_BRIGHT && theme !== THEME_DARK) {
    return;
  }

  document.documentElement.setAttribute(KEY_THEME, theme);
  sessionStorage.setItem(KEY_THEME, theme);

  let isDark = theme === THEME_DARK;
  document.querySelector("label#theme-switch > input").checked = isDark;
}

function toggleTheme(isDark) {
  let theme = isDark ? THEME_DARK : THEME_BRIGHT;
  setTheme(theme);
  themeChannel.postMessage(theme);
}

function getPreferredColorScheme() {
  return matchMedia && matchMedia(PREFERS_DARK_SCHEME_MQ).matches
    ? THEME_DARK
    : THEME_BRIGHT;
}

function getActiveTheme() {
  return sessionStorage.getItem(KEY_THEME) || getPreferredColorScheme();
}

function themeChannelListener(e) {
  if (e.data === ACTIVE_THEME_REQUEST) {
    themeChannel.postMessage(getActiveTheme());
  } else {
    setTheme(e.data);
  }
}

matchMedia(PREFERS_DARK_SCHEME_MQ).addEventListener("change", function () {
  setTheme(getPreferredColorScheme());
});

addEventListener("DOMContentLoaded", function () {
  setTheme(getActiveTheme());
  themeChannel.addEventListener("message", themeChannelListener);
  themeChannel.postMessage(ACTIVE_THEME_REQUEST);
});

/* <!-- smooth scrolling for anchor links on the same page --> */
addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("a[href^='#']").forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      let target = document.querySelector(`[id="${this.hash.substring(1)}"]`);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    });
  });
});

/* <!--
  Adds an anchor link to all the headings > h1 in the `article.post` container.
  Clicking the link sets the window location hash to the ID of the parent
  heading. It then copies the new window location to the clipboard.
--> */
function updateWindowLocationHash(hash) {
  if (history.pushState) {
    history.pushState(null, null, hash);
  } else {
    location.hash = hash;
  }
}

function copyToClipboard(data) {
  if (!navigator.clipboard) {
    return;
  }

  navigator.clipboard.writeText(data);
}

addEventListener("DOMContentLoaded", function () {
  let main = document.querySelector("main");
  if (!main) {
    return;
  }

  let anchor = document.createElement("a");
  anchor.title = "Copy permalink to the clipboard";
  anchor.innerHTML = "&#35;";
  anchor.classList.add("anchor");
  anchor.setAttribute("aria-hidden", true);

  let selector = "h2[id], h3[id], h4[id], h5[id], h6[id]";
  main.querySelectorAll(selector).forEach(function (item) {
    let link = anchor.cloneNode(true);
    link.href = `#${item.id}`;
    item.appendChild(link);
    link.addEventListener("click", function (e) {
      e.preventDefault();
      updateWindowLocationHash(this.href);
      copyToClipboard(window.location);
    });
  });
});

/* <!--
  Removes extra leading spaces from the given code. If the given code has 4
  lines and all 4 lines have more than 2 leading spaces, then it will remove
  first 2 spaces from all the lines.
--> */
function normalizeWhiteSpace(code) {
  let lines = code.split("\n");
  if (lines.length < 1) {
    return code;
  }

  let spacesToRemove = Infinity;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length < 1) {
      continue;
    }

    spacesToRemove = Math.min(spacesToRemove, lines[i].search(/\S|$/));
  }

  return lines
    .map(function (v) {
      return v.substring(spacesToRemove);
    })
    .join("\n");
}

function createCodeElement(code, language) {
  let element = document.createElement("code");
  element.innerHTML = normalizeWhiteSpace(code);
  if (language) {
    element.classList.add(`language-${language}`);
  }

  return element;
}

function createFileLinkElement(url) {
  let element = document.createElement("a");
  element.innerHTML = "View file";
  element.href = url;

  let container = document.createElement("div");
  container.classList.add("view-file");
  container.appendChild(element);
  return container;
}

/* <!--
  Searches for `pre` elements with `data-src` attribute. For each such `pre`
  element, it attempts to load the content at the URL provided using `data-src`.
  It populates the `pre` element with a child `code` element containing the
  loaded content. It also adds an anchor `a` element to the `pre` container with
  a link to view the original resource. The following optional attributes can be
  used to control its behavior.

  1. `data-view`: URL at which 'viewable' version of the resource can be found,
     e.g., GitHub BLOB URL. Defaults to the URL provided using `data-src`.
  2. `data-start`: Starting line number in the resource to slice the displayed
     content. Indexed starting from position 1. Default: 1
  3. `data-end`: Ending line number in the resource to slice the displayed
     content. Indexed starting from position 1. Default: -1 (end)
  4. `data-lang`: Language hinting, passed to 'highlight.js' for syntax
     highlighting.
--> */
addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("pre[data-src]").forEach(function (item) {
    let url = item.getAttribute("data-src");
    let viewURL = item.getAttribute("data-view") || url;
    let start = parseInt(item.getAttribute("data-start") || 1);
    let end = parseInt(item.getAttribute("data-end") || -1);
    let language = item.getAttribute("data-lang");

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.addEventListener("load", function () {
      let code = `error: unable to load the resource at "${url}"`;
      if (this.responseText) {
        code = this.responseText
          .split("\n")
          .slice(start - 1, end)
          .join("\n");
      }

      let codeElement = createCodeElement(code, language);
      hljs.highlightBlock(codeElement);
      item.appendChild(codeElement);
      item.appendChild(createFileLinkElement(viewURL));
    });

    xhr.send();
  });
});

/* <!--
  If vertical scroll offset is greater than 0, add 'floating' class to the page
  header.
--> */
let floatingHeaderClass = "floating";
let expandedHeaderClass = "expanded";
function reconcileHeaderStyle() {
  let classList = document.querySelector("header.page-header").classList;
  if (scrollY > 0 && !classList.contains(expandedHeaderClass)) {
    classList.add(floatingHeaderClass);
  } else {
    classList.remove(floatingHeaderClass);
  }

  requestAnimationFrame(reconcileHeaderStyle);
}

addEventListener("DOMContentLoaded", function () {
  requestAnimationFrame(reconcileHeaderStyle);
});

/* <!--
  Toggles expanded header state by adding or removing 'expanded' class from
  the page header element.
--> */
function toggleMenu(isExpanded) {
  let classList = document.querySelector("header.page-header").classList;
  if (isExpanded) {
    classList.add(expandedHeaderClass);
  } else {
    classList.remove(expandedHeaderClass);
  }
}