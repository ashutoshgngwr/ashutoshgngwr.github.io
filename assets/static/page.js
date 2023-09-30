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
  If vertical scroll offset is greater than 0, add 'floating' class to the page
  header.
--> */
let floatingHeaderClass = "floating";
function reconcileHeaderStyle() {
  let classList = document.querySelector("header.page-header").classList;
  if (scrollY > 0) {
    classList.add(floatingHeaderClass);
  } else {
    classList.remove(floatingHeaderClass);
  }

  requestAnimationFrame(reconcileHeaderStyle);
}

addEventListener("DOMContentLoaded", function () {
  requestAnimationFrame(reconcileHeaderStyle);
});

function getCircularClipPath(radius, anchor) {
  let anchorRect = document.querySelector(anchor).getBoundingClientRect();

  return (
    "circle(" +
    radius +
    " at " +
    (anchorRect.left + anchorRect.width / 2) +
    "px " +
    (anchorRect.top + anchorRect.height / 2) +
    "px"
  );
}

/* <!-- Toggles menu with a circular reveal animation. --> */
let menuToggleAnimOpts = {
  duration: 1000,
  iterations: 1,
  easing: "ease-in-out",
  fill: "both",
};

function toggleMenu(isVisible) {
  let menu = document.querySelector("#menu");

  let radius =
    Math.ceil(Math.sqrt(innerWidth * innerWidth + innerHeight * innerHeight)) +
    "px";

  if (isVisible) {
    menu.animate(
      [{ clipPath: getCircularClipPath(radius, "#menu-toggle") }],
      menuToggleAnimOpts
    );
  } else {
    menu.animate(
      [{ clipPath: getCircularClipPath(0, "#menu-toggle") }],
      menuToggleAnimOpts
    );
  }
}

addEventListener("load", function () {
  let menu = document.querySelector("#menu");
  menu.style.clipPath = getCircularClipPath(0, "#menu-toggle");
  menu.style.display = "block";
});
