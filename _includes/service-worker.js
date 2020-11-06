const CACHE = "default";

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return (
        cache
          .addAll([
            /* {%- for file in site.static_files -%}
                {%- if file.path contains '/assets/static' %} */
            "{{ file.path | relative_url }}",
            /*  {%- endif -%}
               {%- endfor %} */
            "/site.webmanifest",
            "/offline",
          ])
          /* Don't wait for active clients to close before updating */
          .then(self.skipWaiting())
      );
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
  /* only intercept requests from self origin or github content. */
  if (
    !event.request.url.startsWith(self.location.origin) &&
    !event.request.url.startsWith("https://raw.githubusercontent.com")
  ) {
    return;
  }

  if (event.request.url.startsWith("/assets/static")) {
    /* use cache and revalidate strategy for static resources */
    event.respondWith(
      caches.match(event.request).then(function (response) {
        if (response) {
          event.waitUntil(updateCache(event.request));
          return response;
        } else {
          return updateCache(event.request);
        }
      })
    );
  } else {
    /* use network first strategy for all other resources */
    event.respondWith(
      updateCache(event.request).catch(function () {
        return caches.match(event.request).then(function (response) {
          if (response) {
            return response;
          }
          return caches.match("/offline");
        });
      })
    );
  }
});

function updateCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response.clone()).then(function () {
        return response;
      });
    });
  });
}
