---
layout: compress
---

# Noice: Natural calming noise

## Shared Preset

**Note:** You should open these links using the Noice Android app, rather than
your browser.

<a class="preset-intent">Play <q class="preset-title">unnamed</q></a>

## Download app

- [Noice on
  F-Droid](https://f-droid.org/en/packages/com.github.ashutoshgngwr.noice/)
- [Noice on Play
  Store](https://play.google.com/store/apps/details?id=com.github.ashutoshgngwr.noice)

<style>
  body {
    padding: 16px;
  }

  a.preset-intent {
    display: inline-block;
    width: auto;
    margin: 1rem auto;
    padding: 1rem 2rem;
    border-radius: 0.75rem;
    background: #333;
    color: #fff;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
  }

  a.preset-intent:hover {
    background: #555;
  }

  a.preset-intent:active {
    background: #222;
  }
</style>

<script>
  addEventListener("load", function () {
    var uri = new URL("noice://preset" + window.location.search);
    document.querySelector(".preset-intent").href = uri;
    var params = new URLSearchParams(window.location.search);
    document.querySelectorAll(".preset-title").forEach(function (e) {
      e.innerHTML = params.get("name");
    });
  });
</script>
