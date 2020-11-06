---
layout: post
title: "Playing with Service Workers"
date: 2019-06-25 17:15:00 +0530
tags: web pwa service-worker
---

Yesterday, I stumbled upon [Introduction to Progressive Web Apps][pwa-mdn] on
[MDN][mdn] and spent quite some time with [Service Workers][sw-mdn] in
particular. I don’t exactly remember what motivated me to pursue this, but it
was a fun little ride. Thought I’d share how cool PWAs are!

## Progressive Web Applications

[Progressive Web Applications][pwa-mdn] are a set of practices and Web APIs (in
client browsers) to provide web applications with some native app like
functionalities such as push notifications, background data sync, offline
access, etc. Bare minimum requirements to turn any web app into a PWA are

- Serve content over [HTTPS][https-wiki]
- Implement a [Service Worker][sw-mdn]
- Optionally, add a [web manifest][web-man-mdn]

If you want to learn about PWAs in-depth, head on to this [MDN series][pwa-mdn].

## Service Workers

A [service worker][sw-mdn] is a script written in Javascript which runs
separately from rest of the page. It can't access a page's [DOM][dom] or
interact with users. Its only purpose is to intercept install events and
functional events like `fetch`, `push` and `sync`. It can also send or receive
messages to or from any active clients (tabs or windows). There is another great
article about [Service Worker Lifecycle][sw-lifecycle] at Google Developers
portal.

### Key Events

#### Install

It is the first event a service worker gets. It is only received once per
service worker. If you modify your service worker code, the browser will treat
it as a different service worker and it will receive its own `install` event.
`install` event is a safe place to cache static resources that don't change
often. There are some best practices mentioned in [MDN][sw-mdn] and [Google
Developers][sw-lifecycle] articles but here's how I did it. The
`self.skipWaiting()` call activates it as soon as it finishes installing.

<pre data-start="1" data-end="27" data-lang="javascript"
  data-src="https://raw.githubusercontent.com/ashutoshgngwr/ashutoshgngwr.github.io/8dc7a8b1c977ec714a6c9c3b410b62d6c15fa7e8/service-worker.js"
  data-view="https://github.com/ashutoshgngwr/ashutoshgngwr.github.io/blob/8dc7a8b1c977ec714a6c9c3b410b62d6c15fa7e8/service-worker.js#L1-L27"
></pre>

#### Activate

It is also received only once after a service worker has finished installing.
This is a good place to clean up old caches. I didn't implement any cache
cleanup because this site doesn't generate that much data.
`self.clients.claim()` (in conjunction with `self.skipWaiting()`) installs the
new version of the service worker (if available) and takes over any active
clients that were previously being handled by an older version.

<pre data-start="29" data-end="31" data-lang="javascript"
  data-src="https://raw.githubusercontent.com/ashutoshgngwr/ashutoshgngwr.github.io/8dc7a8b1c977ec714a6c9c3b410b62d6c15fa7e8/service-worker.js"
  data-view="https://github.com/ashutoshgngwr/ashutoshgngwr.github.io/blob/8dc7a8b1c977ec714a6c9c3b410b62d6c15fa7e8/service-worker.js#L29-L31"
></pre>

#### Fetch

This event is triggered every time a controlled client makes a new request. This
is a place where caching strategies are implemented, e.g., whether to serve
resources from cache or network. I used two different caching strategies for
different resources. The first one serves the assets directly from the cache and
triggers a cache update for every request. The second serves all other resources
directly from the network and caches them for offline access.

<pre data-start="33" data-lang="javascript"
  data-src="https://raw.githubusercontent.com/ashutoshgngwr/ashutoshgngwr.github.io/8dc7a8b1c977ec714a6c9c3b410b62d6c15fa7e8/service-worker.js"
  data-view="https://github.com/ashutoshgngwr/ashutoshgngwr.github.io/blob/8dc7a8b1c977ec714a6c9c3b410b62d6c15fa7e8/service-worker.js#L33-L77"
></pre>

#### Sync

A `sync` is a functional event like `fetch`. Clients can request a `sync` to
execute a workload in the background. The workload will continue to execute even
if the browser is closed. Google Developers portal has another awesome article
to [learn `sync` events with a demo][sync-gd].

#### Push

A `push` event is used for subscribing to push notification from a remote
service. I haven't read much about it yet, but [this article][push-gd] is next
on my reading list.

## Installable Web Apps (Add to Home screen)

To make your PWA installable (browsers asking users to add a website to home
screen), you'll need to add a [Web Manifest][web-man-mdn] in addition to the
service worker. It is a JSON file with the [predefined schema][web-man-mdn].
e.g.

<pre data-lang="json"
  data-src="https://raw.githubusercontent.com/ashutoshgngwr/ashutoshgngwr.github.io/8dc7a8b1c977ec714a6c9c3b410b62d6c15fa7e8/assets/site.webmanifest"
  data-view="https://github.com/ashutoshgngwr/ashutoshgngwr.github.io/blob/8dc7a8b1c977ec714a6c9c3b410b62d6c15fa7e8/assets/site.webmanifest"
></pre>

## Conclusion

PWAs are a great replacement for apps that only rely on data and doesn't need
much native functionality. In 2015, Flipkart launched [Flipkart Lite][fk-lite],
a PWA version of its mobile web site and seen a huge bump in conversion rates.
Twitter and Instagram are other great examples.

[pwa-mdn]: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Introduction
[mdn]: https://developer.mozilla.org/
[sw-mdn]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
[https-wiki]: https://en.wikipedia.org/wiki/HTTPS
[web-man-mdn]: https://developer.mozilla.org/en-US/docs/Web/Manifest
[dom]: https://en.wikipedia.org/wiki/Document_Object_Model
[sw-lifecycle]: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
[sync-gd]: https://developers.google.com/web/updates/2015/12/background-sync
[push-gd]: https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications
[fk-lite]: https://stories.flipkart.com/introducing-flipkart-lite/
