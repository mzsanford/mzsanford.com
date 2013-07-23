Title: Language Detection Geekery
Author: Matt Sanford
Date: 2009-01-26 16:40:21

There have been a few questions on the Twitter API development list asking
about how search.twitter.com is able to detect the language of a tweet. The
methods used are nothing new to the field of natural language processing
(NLP), but most developers haven't studied much NLP. I'll cover the industry
standard method we're using, as well as the shortcomings.  I'm a language geek
but not a linguist or NLP scientist so I started with a knowledge of
programming but not of the existing techniques for language detection. I was
able to recognize spoken and written languages I didn't speak and that sparked
my interest in what I was gleaning that information from. I'm no protege so
there must be some simple mental process. I thought language-specific search
would be nice so I read up and started on the code.

## Most Common Words

My first thought was that you can determine a language by using some of the
most common words. I spent a lazy Saturday afternoon thinking about it and
came up with an idea. While 'die' is a word in English, it's a very common
article in German (feminine 'the'). I started to think about how I could
leverage that knowledge to detect languages but ran into a wall. You see, I
speak German so it wasn't a good explanation for my ability to pick up the
difference between spoken Chinese and Korean. Those two bring up a good point,
the way I determine those in writing (characters) differs from how I do in
speech (tones). In languages, the most common words tend to be the shortest
and with only a limited number of syllables it seemed like my common-words
method was doomed to failure.

It seemed clear my first idea wasn't going to work but it seemed close to a
statistical method for identifying a language. That phrase 'statistical
method' made me think of conference papers so I started searching those. That
reading not only brought me up to speed on the current state of language
detection, but increased my general language interest.

## Character Distribution

I was pleasantly surprised to find out I wasn't totally off base in looking at
distribution of the data. It's the basis of statistical analysis so how could
I really be that far off, but being new to all of this I feared I had made the
most rookie of mistakes. It turns out that if you chop words up into groups of
letters and store the distribution for each language they are different enough
to let you determine a language with pretty good accuracy.

This method is very successful but in requires that you have a large set of
training data for each language in order to get an accurate distribution.
There are some academic collections you can use, but not for a commercial
product. My background in is in web crawlers, so crawling a series of sites
for each language seemed reasonable. The problem was, without language
detection I wouldn't know what language it was. A bit of a catch-22.

Enter Wikipedia. There data is divided by language, freely available, large,
and created on a variety of subjects by a variety of authors. In my brief NLP
and language reading I had already learned that the subject, author and
audience of a work will have a large influence on the types of words used. For
example, if you did your English training on legal contracts you would think
we say use much more Latin that we really do.

The code for doing this character distribution work can be found in
[Nutch](http://lucene.apache.org/nutch/). That code was hard to find when
searching for language detection. Being a crawler developer I remembered
seeing it and verified it works based on character distribution. My crawlers
and my language hobby were coming together at last. I did some crawling for
additional languages from Wikipedia and then realized that ideographic
language fail using this method since they don't use as restrictive of an
alphabet.

## Ideographic Languages

While the character distribution method handles languages using the Latin
alphabet really well it does break down on some other alphabets. It works
surprisingly well on languages using the Arabic alphabet (Arabic, Farsi, etc),
as well as Cyrillic, Hebrew and a slew of others. I am guessing any semi-
phonetic language is going to match that pattern. Where it has problems is
Kanji, since a word is not made up of a combination of characters from a small
set.

I don't speak Chinese or Japanese but I used them as a good example of two
ideographic languages that the character distribution method fails to
differentiate. What's interesting between these two is that Japanese actually
uses several different character sets for text. You can see in the Unicode
table there are Kanji, Hiragana and Katakana … which got me thinking: What if
you used the statistical distribution of character sets?

As it turns out this gives reasonably good results. Good enough that they are
worth keeping. I removed all ideographic training data from the character
distribution check and made the code try a second method where it checks the
character **set** distribution. A bit of manual evaluation and some checks for
minimum confidence later and it seems like we are sorting Chinese from
Japanese correctly often enough to make me, a non-speaker, happy.

## Conclusions

I'm not a linguist. I'm not a computational linguist. I'm a programmer who is
facinated with language. I learned the basics of language detection and
extended it a little to cover ideographic scripts. I've had some success and I
hope this helps you have a little too. Our training data still needs some
work, but I think over all I've found a solution that is pretty damn good for
the cost … which was my time and a little CPU.

