Title: Character Direction for Developers
Author: Matt Sanford
Date: 2009-02-06 21:54:48

When English speaking developers first encounter languages like Hebrew or
Arabic where things are written from right to left they react in one of two
ways. Either they see this as insurmountable to support in their application
or they feel the opposite and assume that since they have UTF-8 everything
will just work. While most modern programming languages support UTF-8 encoding
that does not mean that everything does it correctly, and often the right-to-
left layout is an overlooked part of UTF-8 support. This post hopes to clarify
a little bit about right-to-left processing and Arabic in particular since I
speak some of that and it inspired this post.  For the more detail oriented
please note that I've skipped any discussion of endian-ness.

## Which Way Do The _Bytes_ Go?

This is a common source of confusion with right to left languages, even for
advanced developers. When English developers think of text they think of bytes
streaming from left to right, top to bottom, the same way they read. While
that's the way we visualize the data it is, in fact, just a string of bytes
without any direction. It's best to break with any confusing directionality
and think of the bytes as running in a single top-to-bottom line. Here's some
sample english text to belabor the point:

    
    abcd  0x61 0x62 0x63 0x64  
    becomes:  
    a  0x61
    b  0x62
    c  0x63
    d  0x64

With that little visual exercise out of the way I can move on to right-to-left
languages. If you look at the second part of the above it is the same order
was the bytes used for right-to-left languages. **The first character a native
speaker would write is the first character in the data stream**, the second
comes next, and so on. This is nothing revolutionary but I can't count the
number of times I have heard skilled developers say things like "but in Arabic
the string is backwards". It's very easy to fall into the trap, don't be
fooled. The string isn't stored in reverse order, it is _displayed_ in reverse
order.

## Who Makes Right-to-left Flow from right to left?

As stated above the bytes for a right-to-left string are stored in the same
logical order but are displayed in reverse. That sentence _almost_ makes the
assumption that UTF-8 "just handles" right-to-left correct. The main problem
is that it's all up to the display program to do things correctly. If your
application is using a web browser or OS standard text control you're probably
using the OS text layout engine. These modern layout engines are probably
going to work out fine, I know they do in all of the OS's I've used recently.
Where things get more interesting is in graphics processing libraries. If you
are writing (or using) a graphics processing library that focuses on primitive
drawing (line, shapes, etc) it's very likely the text layout engine was an
after thought. It's also pretty likely it was added by an English speaking
developer with no thought toward non-Latin scripts (right-to-left as well as
ideographic systems like Chinese).

That's all well and good but it doesn't explain how layout engines _should_ be
handling right-to-left layout. I've never designed a text layout engine … it's
hard and the OS native ones do a great job. I'm not writing this to explain
how to write a layout engine. Firstly it's a complicated subject of which I
only know what I need, and secondly I would caution anyone against writing
such a thing again** **. What I want to cover is the basics of how the bytes
in the same order as Latin scripts end up the other direction. Oddly that
contrast is best covered in the next section, where you'll see them together.

## Mixed Directionality

Text with mixed character sets is very common across the internet. A big part
of this is that HTML and HTTP are both run on the Latin script (hell, they're
all English and English abbreviations). This means the HTML markup and things
like URLs need to co-exist with right-to-left content in many places. Website
names are a perfect example of that. The basis of directionality in Unicode is
that all **directionality is defined on a per-character basis**. I'll start
with an example and explain from there.

    
    Text: abابab  
    Unicode Bytes     Letter
    ------- --------- ------
    U+0061  0x61      a
    U+0062  0x62      b
    U+0627  0xD8A7    ا
    U+0628  0xD8A8    ب
    U+0061  0x61      a
    U+0062  0x62      b

There is an [algorithm for bidirectional character
layout](http://unicode.org/reports/tr9/tr9-15.html), but I find it's easiest
to think of it as: A group of character with the same directionality are
processed by the layout engine together. This means that a group of right-to-
left characters surrounded by left-to-right characters will be reversed, as a
native speaker would expect. This also means that a single character of a
different directionality does not break those around it (like aبc). I'll use
bytes so it's clear what I mean. If you look at the example above you'll see
that after _0x62_ you next see _0xD8A8_, which is the fourth character. When
the layout engine reaches the third character (_0xD8A7_) it finds a
directionality of right-to-left, then the fourth character (_0xD8A8_), which
is also right-to-left. Since these are both right-to-left they are displayed
as such. The following character is once again _0x61_, which is again a change
in directionality.

## Arabic Complications to Layout

I started working on this post because I have an interest in languages and
computers. But probably more so because I speak some Arabic and it has some
interesting text layout issues. Right-to-left is one of the most obvious
issues, but the character connection is one that I have seen unimplemented
most often (Adobe Flash, TextMate, etc.). Arabic is written with characters
that connect to the subsequent character, sort of like cursive in English.
Arabic complicates that a bit more by having some characters that connection
on both sides (like ب) and other that only connect on the right (like و). This
post isn't about Arabic letter forms but it shows where text layout engines
are more complicated than people think. Let's look at one quick example of
what characters I type versus what is displayed.

    
    I Type (and store in a file): ل ل ل  
    Unicode Bytes     Letter
    ------- --------- ------
    U+0644  0xD984    ل
    U+0644  0xD984    ل
    U+0644  0xD984    ل  
    Displayed As: للل  
    Which are actually the characters …  
    Unicode Bytes     Letter
    ------- --------- ------
    U+FEDF  0xEf889F  ﻟ
    U+FEE0  0xEF88A0  ﻠ
    U+FEDE  0xEf889E  ﻞ

As you can see the characters stored and the characters displayed are all
different. This choice to use different characters in order to make the
letters connect is done by the layout engine. Writing this was actually quite
hard since I did it in TextMate and it uses a text layout engine that does not
connect characters.

## Language Is More Than Characters and Words

This was a very simple explanation of right-to-left character display. Nothing
revolutionary but the idea was to point out that applications usually fall
between the two initial reactions of dread and the expectation it will all
"just work because I've gots teh Unicode". This post leaves out the very large
localization issues that right-to-left languages create. I'll use web design
for some examples, since it's something I know and something you're likely to
know as well:

  1. Should the sidebar still be on the same side? Think back to how you chose a side.
  2. Your CSS _float:_ attributes are probably wrong.
  3. Your header items are in the wrong order.
  4. Your images may point the wrong way.
This skips the cultural issues of Hebrew and Arabic localization (obviously
different in many ways), but I want to touch a bit on that last one since it's
a favorite of mine. Imagine the stock photo of a soaring business chart with
the climbing red line and no scale. Now imagine if you read from right-to-
left, and thus thought of the X-axis as reversed … you just told everyone
you're failing more every day. Good job.

