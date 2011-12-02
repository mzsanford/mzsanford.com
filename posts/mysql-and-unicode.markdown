Date: 2010-12-28 13:51:08
Title: MySQL and Unicode
Author: Matt Sanford

I used MySQL for a great many projects over the years with the assumption that
a charset of `utf8` and a collation of `utf8_unicode_ci` was going to support
all of UTF-8 and that was all I need to do. I was sorely mistaken but there
was no point in writing until now, because MySQL 5.5 has finally helped
rectify the issue. Up until MySQL 5.5 (released December of 2010) the UTF-8
support was severely hobbled. With MySQL 5.5 the server can now support the
full range of characters that UTF-8 allows but it's not the default behavior.
There are still plenty of pitfalls for the naïve developer starting out with
MySQL.

## The root cause and how the problems surface

If you work on internationalization issues and use MySQL you've probably run
into this. If not then it's only a matter of time until you run into it. This
is the dirty little secret of MySQL before 5.5 … it only supports characters
within the BMP (more on what that means in a moment). With Unicode
[6.0](http://www.unicode.org/charts/PDF/U13000.pdf) over 50% of all characters
are outside of the BMP so that's a big deal. To me it was a big deal before,
but with Unicode 6.0 it's bigger and now people are starting to take notice.
Supporting half of a character set is almost worse than not supporting it
since it's difficult to figure out what's going to happen when you send data
to the server.

Most of the bugs caused by this poor UTF-8 support don't surface in English,
and that's why many developers remain blissfully unaware of the problem.
Having said that, this is not something that's only found when user's write in
[Deseret](http://en.wikipedia.org/wiki/Deseret_alphabet) or [Egyptian Hieroglyphs](http://www.unicode.org/charts/PDF/U13000.pdf) (PDF), it also
comes into play with Japanese names and some new Unicode characters like
Emoji.

The MySQL defaults also have an effect on Unicode processing that affects the
majority of European languages you're likely the try and target. This unsafe
default  has a different root cause but I want to cover it here so the two
issues are not confused with each other. Here are how some of the most common
issue surface:

  * Attempting to update a record where a `varchar` column changed only by a single accent will return success but not save the change 
    * This makes spelling corrections in record seem to "not save".
  * A row can be inserted successfully but when it is re-read the `varchar` column is empty or missing characters. 
    * This is the case with the Ruby driver at least, probably others.
  * Unique constraints on `varchar` columns will fail despite different text if the differences are all outside of the BMP.
  * You can't store the new Emoji characters, or they seem to disappear.

### The supplementary character issue

The crux of the UTF-8 issue is rooted in the fact that UTF-8 is a [variable-width encoding](http://en.wikipedia.org/wiki/Variable-width_encoding). The
MySQL 5.1 implementation (like many others) was built on the assumption that a
UTF-8 encoded character would use between 1 and 3 bytes. The beauty of UTF-8
is that it is compatible with ASCII (and by proxy the beginning of ISO-8859-1,
which is also ASCII compatible) for the most common characters in English,
using only 1 byte, but that the variable-width encoding scheme lets it also
support the rest of Unicode. Here's the rub: "the rest of Unicode" is an
expanding set and when it passed a certain boundary UTF-8 needed 4 bytes to
handle it. Let's have an example:

` 1 byte  (0000-007F): "A"  ➔ 0x41 2 bytes (0080-07FF): "Ж" ➔ 0xD0 0x96 3
bytes (0800-FFFF): "龍" ➔ 0xE9 0xBE 0x8D 4 bytes (> FFFF)   : "В" ➔ 0xF0 0x90
0x90 0x92`

As you can see above, that last character takes 4 bytes in UTF-8 while MySQL
only expects 1-3 bytes per character. Without getting into too many Unicode
details it's important for our discussion to know that the Unicode characters
are logically divided into
"[planes](http://en.wikipedia.org/wiki/Unicode_plane)". The first plane is the
Basic Multilingual Plane (BMP) and what you probably think of as "Unicode".
This is all of the characters between `U+0000` and `U+FFFF` and covers most of
the characters for the major languages of the world. When Unicode starting
using the additional planes it started addressing characters beyond `U+FFFF`
and UTF-8 expanded to handle that.

The MySQL 5.1 `CHARSET` "`utf8`" and the `utf8_*` collations were only able to
handle 1-3 bytes so they had to do something. That something was mentioned
depends on your client driver. In Ruby the insert succeeds but the data is
discarded. In Java an exception is thrown, which at least alerts you to the
problem. With the addition of [Emoji](http://en.wikipedia.org/wiki/Emoji) in
Unicode 6.0 this problem has a very high profile failure case when the text is
Emoji-only. For Japanese mobile phone users this not an uncommon use case, and
you can expect it to get more common in the US very soon.

### The problem with accents

The problem I mentioned above with accent changes not taking effect is
actually a configuration problem rather than a MySQL bug. This has to do with
the common misunderstandings around MySQL collation and specifically the
`utf_general_ci`/`utf_uncode_ci` collation sequences. This is probably best
illustrated with an example:

` mysql> select "bar" = "bär" COLLATE utf8_unicode_ci\G
*************************** 1. row *************************** "bar" = "bär"
COLLATE **utf8_unicode_ci: 1** mysql> select "bar" = "bär" COLLATE
utf8_general_ci\G *************************** 1. row
*************************** "bar" = "bär" COLLATE **utf8_general_ci: 1**
mysql> select "bar" = "bär" COLLATE utf8_bin\G *************************** 1.
row *************************** "bar" = "bär" COLLATE **utf8_bin: 0** `

If your default collation is `utf_general_ci` or `utf_uncode_ci` then your
database thinks "bar" and "bär" are the same word. If you have unique
constraints on a column this is clearly problematic but this can also cause
problems without that. This is the root cause of the "accent changes won't
save" problem. When updating a record it appears MySQL (or at least InnoDB)
checks for equality before updating a record. Since and accent-only change is
considered equal by the collation MySQL skips the write (which saves I/O
overhead) and returns success since it thinks it optimized a write rather than
failing.

English speaking developers very often assume that MySQL is mature and will
"just work" in every language. The default character set for MySQL is `latin1`
(rather than `utf8`) and many developers have learned to dutifully change that
to `utf8` and `utf8_general_ci` when they install MySQL. This change fixes a
large swath of issues but leaves behind these much more subtle bugs.

## The MySQL 5.1 guidelines and work arounds

If you need to stay on MySQL 5.1 there are a few things worth keeping in mind.

  * Using `utf8_bin` for collation will solve the accent issues, which is probably what you thought the other `utf8_*` collations where doing. The downside to this is that `utf8_bin` and `ORDER BY` will not be in language-specific order. You'll have to make the choice for yourself depending on your needs but my advice would be that if you don't know you should go with `utf8_bin`.
  * If you want to fully support non-BMP characters your only recourse is to convert your `char`/`varchar` column in question to a `binary`/`varbinary` and make sure you handle the character encoding correctly on the way in and out. If you use UTF-8 be sure to allow 4 bytes per character (as discussed above). If you use UTF-16, make sure you allow 4-bytes to handle [surrogate pairs](http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates). The downside to this is the subtle differences in how [binary and varbinary columns](http://dev.mysql.com/doc/refman/5.1/en/binary-varbinary.html) are stored and you should fully understand that and the performance implications before making any changes.

## The MySQL 5.5 fix

MySQL 5.5 was just released with new character sets for `utf8mb4`, `utf16` and
`utf32`. While `utf16` and `utf32` support is certainly welcomed I want to
focus on `utf8mb4` since my assumption is that you want ASCII compatibility.
The newly added [`utf8mb4`](http://dev.mysql.com/doc/refman/5.5/en/charset-unicode-utf8mb4.html) character set is a superset of the `utf8` character set
that can store up to 4 bytes per character. With 4 bytes per character
`utf8mb4` should be able to store all 16 planes, including planes 4-13 which
are currently empty and given the known writing systems in the world are not
expected to be filled.

The addition of `utf8mb4` makes me breath a little easier. You still have to
know your collations to not reproduce the accent problem but I trust you can
remember that small piece of Unicode/MySQL knowledge. If not, maybe you'll
google again in the future an find this handy command:

> `ALTER TABLE table_name CONVERT TO CHARACTER SET utf8mb4 COLLATE
utf8mb4_bin;`

