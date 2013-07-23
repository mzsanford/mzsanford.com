---
title: Tokens are not just for Chuck-e-cheese
date: 2009-10-15 02:53:00
permalink: blog/tokens-are-not-just-for-chuck-e-cheese/index.html
layout: post
---

Tokenization refers to splitting any data into chunks, and in the case of this
post I'm focusing on splitting text into words. The process of turning free-
form text into individual pieces of information (word, phrases, sentences,
etc) is something that natural language parsing (NLP) researchers have been
interested in for years. There is a whole field of study on the subject that
this post does not hope to even touch on. For developers with no language
experience this process is usually overlooked as absurdly simple, I mean
`split(/\W+/)`, right? If you nodded then this is for you. If you think that
was overly simple this will probably be old hat.

## English Can Be Easy

English, as my native language, turns out to be one of the easier languages to
do basic tokenization on. By basic I actually refer to `split(/\W+/)`. This
will split a sentence into words and it will be correct in many cases. Like
everything else in English, it's pretty much defined by its exceptions.
Hyphenated words are a pretty obvious stumbling block but there are some
others as well.

## English Can Be Hard

Depending on what you're planning to use data for there is some more
processing that might be needed. Data normalization is a normal step in almost
every process so I don't think anyone will find that surprising. Like any
other normalization this is very dependent on what you plan to do, and this is
where English can get tricky. Here are a few of the common normalization tasks
with words:

  * remove "stop words" (a, the, and, but, etc) since they don't really tell you much.
  * removing plurals and other sufficies, usually via [stemming](http://en.wikipedia.org/wiki/Stemming). This can be pretty hard to get right, especially if you have a vocabulary of jargon.
The same thing goes for many other european languages. What varies between
these languages isn't the delimiters, which are still spaces and punctuation,
but instead the amount of normalization needed. While your project might not
need stemming for English it's possible that the vowel-changes in German
conjugation will require it. One other small detail people skip is that `\w`
(or the inverse, `\W`) may not match accented characters depending on your
programming environment.

### A Quick German Digression

While talking about normalization of languages people may or may not speak
it's always good to give an example of something language-specific. I speak
German so it's a natural choice for an example. I implied above that the major
difference between English and other european languages is normalization, but
there is a German specific issue that blurs the line between tokenization and
normalization … decomposition.

German is pretty notorious for having long, silly sounding words. What people
often miss is that these are actually compounds. For example sliced sugar
beats used during the process of sugar processing is called
zuckerrübenschitzel:

![zuckerrübenschitzel]({{ site.url }}/assets/tokens-are-not-just-for-chuck-e-cheese/zuckerruebenschitzel.jpg)

Now, that seems like a bit of a specialized word to me, however this was a
label in a museum. You see, it's actually three words: zucker (sugar), rüben
(beat), schnitzel (slices). So, while that's one token, it can be decomposed
into 3 words … if you need to do that decomposition or not depends on your
application. How you actually do that is a whole 'nother blog post.

## And CJK Is Always Hard

So, English can be hard to process depending on how you plan to use the data.
Chinese, Japanese and Korean are pretty much always hard. Lately I've been
working on the problem of Japanese and I'll do a full post on that at a later
date. For English speakers, consider how you would process things if there
were no spaces between words. The three writing systems in Japanese provide
some clues but the essence of the problem is the word delimiters. I'll leave
at this for now and do a post on Japanese tokenization later.

### A Japanese Digression

Without going into the nitty gritty of Japanese tokenization there is a pretty
good example that comes to mind. Imagine a [system](http://twitter.com) that
lets you post short messages, and that many of those contain links. Now assume
that at display time you want to automatically link the URLs that appear in
the message. Now, here we go in Japanese (well, some Japanese characters laid
out like a short message):

    
    ののhttp://example.com/のの

Auto-linking requires that you identify the URL in the midst of all of the
other text. While this is a pretty simple problem I should point out that the
default auto linking in many languages and libraries do not handle this
correctly. The easiest route is to use what you know about valid URL
characters (simplified to host name only, other URL components are left to
people willing to read the RFC):

    
    message.gsub(/http:\/\/[a-z0-9-\.]+\.[a-z]{2,}\/?/i) {|url| … }

## Arabic (you knew it was coming)

I've mentioned Arabic before and it's normally either ignored when talking
about internationalization or it's skipped after some hand waving about right-
to-left. Arabic is a phonetic language every bit as much as English (arguably
more so … I'm looking at you _faux pas_) with an alphabet and spaces between
words. To some extent it's just like the european languages I mentioned above
… almost.

Arabic relies very heavily on prefixes and suffixes connected directly to
words. The most ubiquitous of these is the definite article ال (Al-, meaning
"the"). It's questionable if this is strictly a tokenization problem, but it
does mean that using Arabic data without specific normalization is of very
limited usefulness. Possession is represented by a suffix attached directly
also, as are a myriad of other things. This is sort of like the German example
above, only that it effects so many words that you'll have to tackle it sooner
if you plan to find meaningful data.
