---
title: Unicode with Ruby - Regular Expressions
date: 2010-01-12 04:58:18
permalink: blog/unicode-with-ruby-regular-expressions/index.html
layout: post
---

Unicode support in Ruby doesn't get much attention. Most of the information
about it focuses on MySQL more than it does on actual Ruby support. Ruby can
read and write Unicode data without much trouble but actually working with it,
and moreover making sure it does not get corrupted, is one of the lesser
visited back-alleys of Ruby. Hopefully I can make some more time to blog about
other Ruby/Unicode interaction but I have to start somewhere so Regular
Expressions are as good a place as any. Perhaps better since they're their own
dark art.

## Word To Your Mother

When it comes to Unicode and Regular Expressions the `\w` escape (for matching
word characters) is the most commonly misused. Ruby makes this situation all
the more difficult by changing behavior based on a global variable, `$KCODE`.

When most programmers use the `\w` escape they mean `[a-zA-Z0-9_]` (which is
how POSIX defines `[[:word:]]`) and Ruby will work like that … until the
`$KCODE` changes. Once `$KCODE` is set to `u` (Unicode) the `\w` escape starts
matching any word character in any langage, including things like ش or ㌳.
Check out [gist 274731](http://gist.github.com/274731) for a working example,
or the [similar patch to the OAuth gem](http://github.com/mzsanford/oauth/commit/470c08ec3a9b55e85a6f5bbc730d387f3bf7afa2), which shows that this isn't only
theoretical. It isn't just complex things like OAuth request signatures,
imagine this as a validation on a user name (which would allow some of the
commonly confused characters, like í).

## Space (`\s`): The Final Frontier

Another common misconceptions about Regular Expressions is that the `\s`
escape handles all space characters. While it does match more than "` `"
(`U+0020`) alone it's by no means complete. There are a multitude of space-
like characters in the Unicode standard but when it comes to natural language
there is a small subset that will suffice in the vast majority of cases. In
fact, `U+0020` will cover most languages but fails on east Asian ideographic
alphabets (which don't space separate words, as I've [mentioned in the past](tokens-are-not-just-for-chuck-e-cheese)) where the full-width space (`U+3000`) is used.

If you're well versed in Regular Expressions you might consider POSIX
character classes the answer to the problem. The POSIX standard defines the
longer named character class `[[:space:]]` but it's a direct equivalent to the
`\s` escape. For a practical demonstration check out [gist 274725](http://gist.github.com/274725) over on github.

## Matching Numbers

Not every country and language uses the same numeral system. One thing that
makes programming slightly easier is that the arabic numeral system
(`0123456789`) has become more or less the standard throughout in computing
world. This convenience has allowed Ruby (and most other languages) to ignore
the alternate numbering systems Unicode allows. A rather contrived example is
that of braille but a much more common one is the numeral system used in
Egypt, the so-called "Arabic - Indic" digits (`٠١٢٣٤٥٦٧٨٩`). As you can see
from [gist 274737](http://gist.github.com/274737) on github the `\d` escape
does not match any of these (nor does `[[:digit:]]`) and `String#to_i` doesn't
handle them either. Again, the good news is how prolific the arabic numeral
system has become.

## Conclusion

No programming language handles Unicode perfectly, and Regular Expressions are
very often problematic corners of Unicode support. This isn't Ruby specific
and to be totally fair Ruby does a better job than some others. Like all posts
this isn't exhaustive as much as an introduction to some of the most common
issues. If you're interested in more information feel free to contact me on
Twitter ([@mzsanford](http://twitter.com/mzsanford)) or [apply to work with me](http://bit.ly/7PL1J3) on the interesting problems I'm finding every day.
