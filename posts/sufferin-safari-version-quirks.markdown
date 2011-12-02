Date: 2011-07-14 12:06:24
Title: Sufferin' Safari: Quirks Between Safari Versions
Author: Matt Sanford

Browser incompatibility is so 1999, isn't it? Well, while we spend our time
fretting about IE version incompatibility and cross-browser issues we often
overlook the version issues of other browsers. Over the past week I've been
working on the [twitter-text-js](https://github.com/twitter/twitter-text-js)
support for hashtags in Russian, Korean, Japanese and Chinese. Along the way I
ran into two bugs in some versions of Safari that surprised me. I didn't find
much online about it so I wanted to take a moment and jot this down.

## Non-ASCII URL Hashes

The first bug I ran into has to do with assigning a new value to
`window.location.hash` in Javascript. Our site uses the hash (or anchor)
portion of the URL quite extensively in something generally called "hashbang
URLs". Two of my colleagues at Twitter have discussed the
[pros](http://www.adequatelygood.com/2011/2/Thoughts-on-the-Hashbang) and
[cons](http://danwebb.net/2011/5/28/it-is-about-the-hashbangs) of this
approach publicly but what's important here is that we use it today and
therefore do more work with the hash portion of the URL than most people. This
matters for hashtags because we catch the click on hashtag links and navigate
by assigning the search to the `window.location.hash`.

Safari 5.0.5, and possibly earlier versions, are buggy in the implementation
of assignment to `window.location.hash`. This isn't a quirk, or a feature-I
-do-not-appreciate, this is a bug. It's fixed in 5.1 which makes me very
happy. Our site was attempting to assign `#томск` to the window.location.hash
but the page kept switching to `#B><A:`. After a bit of reflection on the
issue I noticed that the two are the exact same number of characters. What a
curious coincidence. Well, it turns out it's much worse than I thought:

![Safari 5.0.5 hash alteration](sufferin-safari-version-quirks/hash-smash.jpg)

Look at that! Safari 5.0.5 seems to have turned all of our well formed Unicode
into ASCII by stripping out all of the high bits. I thought this must be a
problem with our page but our pages are UTF-8 encoded so those are not even
the bytes on our page (and it also works in all other browsers, which is
always suspicious). The fix for this was quite simple. If you re-build the
complete URL and assign it to `window.location.href` the encoding is left
intact. As a bonus, Safari correctly recognizes that the only change was the
hash and does not trigger a full page reload. If you're using hashbang URLs in
languages other than English this might bite you. Beware of changing to
`window.location.href` because IE does a full page reload, thus disabling your
carefully crafted hasbang plans.

## Regular Expression Size Limit

After testing our new hashtag regular expression in a myriad of browsers we
thought we were covered. It turns out that Safari 4.0 and below have a limit
on the maximum size of a regular expression that is lower than the browsers we
tested. I had tested in Safari 5.1, because it is what I have, as well as
several versions of Firefox and IE. Running multiple versions of Safari on a
Mac is somewhere between impossible and difficult as far as I can tell, so
beware of this one because it's hard to test.

The regular expression in question contained a character class that had every
Chinese character, which was admittedly excessive. We were able to refactor
into character ranges and verify that it works in all of our supported
browsers, so this was more of a coding inconvenience that a serious bug. The
inability to run two versions of Safari feels like it's setting me up for more
failures like this in the future. If versions don't act the same (and they
shouldn't, otherwise what's the point?) then developers will need a way to run
multiple versions to test. Without that this is a losing battle.

