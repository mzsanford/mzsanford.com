---
date: 2013-11-12 18:00:00
title: NSURLCache And The Accept Header

permalink: blog/nsurlcache-accept-header/index.html
layout: post
---

HTTP caching is critical to networked application on mobile devices. While tuning the various cache headers on a REST API I became interested in how [NSURLCache](https://developer.apple.com/library/ios/documentation/Cocoa/Reference/Foundation/Classes/NSURLCache_Class/Reference/Reference.html) under iOS was going to react.

## The `Accept`able Question

This all came up because of a library that used the `Accept` header to communicate the requested API version<label for="sn-demo" class="margin-toggle sidenote-number"></label><input type="checkbox" id="sn-demo" class="margin-toggle"/><span class="sidenote">`Accept: application/json;version=1`</span> instead of the URL path<label for="sn-demo" class="margin-toggle sidenote-number"></label><input type="checkbox" id="sn-demo" class="margin-toggle"/><span class="sidenote">`/api/v1/…`</span>. I was initially against the idea but that sort of gut reaction is not enough. It could easily be a better approach and how would I know until I actually test my preconceptions? So, off I went to test a few things.

There are a few issues to consider about the `Accept` header approach to API versioning but there was one that I couldn't even list pros and cons for. I couldn't be sure was how it would effect the cache on the client. I have worked with [Varnish](https://www.varnish-cache.org) for HTTP caches in the past and I remembered the various `Accept` and `Vary` header issues for internationalization.

## Testing … 1 … 2 … Testing.

One quick [example iOS app](https://github.com/mzsanford/URLCacheTest) later and it was confirmed. A page with no `Vary` header (or `Vary: *`) will hit the cache no matter what `Accept` header is sent. Here is the log (note the `CACHED`):

    2013-11-12 14:05:35.555 URLCacheTest[13227:70b] Requesting URL: https://abs.twimg.com/errors/twitter_web_sprite_icons.png
    2013-11-12 14:05:35.556 URLCacheTest[13227:70b] Sending accept header value: api/v2
    2013-11-12 14:05:35.558 URLCacheTest[13227:70b] CACHED: Non-error response code with 65084 bytes of data: 0.000851 sec
    2013-11-12 14:05:39.404 URLCacheTest[13227:70b] Requesting URL: https://abs.twimg.com/errors/twitter_web_sprite_icons.png
    2013-11-12 14:05:39.404 URLCacheTest[13227:70b] Sending accept header value: api/v3
    2013-11-12 14:05:39.407 URLCacheTest[13227:70b] CACHED: Non-error response code with 65084 bytes of data: 0.001124 sec

I did also did an additional test of [Varnish](`https://www.varnish-cache.org`), which returns `Vary: Cookie,Accept-Encoding`, and altered the `Accept-Encoding` header with the same result.

## Conclusion

The `NSURLCache` does not take the `Accept` request header into account when calculating the cache key. It would seem that it also ignores the `Vary` header in the response. If you're going to use an HTTP cache in iOS for a REST API with the version in a header you're going to need to do some additional work.
