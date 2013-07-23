---
date: 2010-05-15 19:33:21
title: Unicode Security&#58; Yes, there is such a thing
permalink: blog/unicode-security/index.html
layout: post
---

Like all aspects of computers Unicode has its own security issues. And like
all Unicode issues most engineers spend their entire professional career
trying to avoid dealing with them. It's ok, you can be honest, I understand.
When I gave my talk about Twitter International at Chirp (the Twitter
developer conference) I mentioned some of these issues. After that talk I was
surprised how many people who know more about internationalization than I do
said they hadn't considered some of these issues.

I'm not going to go into a ton of detail since I'm not a security researcher.
I am, however, and engineer focused on international and as such I think it's
my business to know where my push to internationalize everything reaches it's
limit. If you're in a similar position, pushing people to internationalize,
you should make sure you fully understand these issues. If you push people to
internationalize and in the process create security flaws you'll be spending
your credibility. Don't spend it on this – the cost is too high.

I recommend the awesome paper [Unicode Security Considerations](http://www.unicode.org/reports/tr36/) (Unicode Technical
Report #36) as it served as the basis for this whole post. The problem is,
Technical reports are tedious to read so I'm adding this teaser. Here are some
highlights (lowlights?) of Unicode security:

## Character Ambiguity

The most common security issue I've seen with internationalized products is
character ambiguity. This same property is commonly used for spam but it also
poses security risks. Character ambiguity is using characters from different
writing systems that look very similar to the expected characters. People see
what they expect to see … this is the enemy.

![Image from Flickr]({{ site.url }}/assets/unicode-security/look-alike.jpg)

The security risk of ambiguity is mostly related to impersonation.
Impersonation is the underlying mechanism for phishing, which we can all agree
is a major security problem. While ASCII alone contained ambiguity (Capital I
looks an awful lot like lower case L in many fonts) Unicode expands the
problem. For example, full-width latin characters, like "ｆｏｏ", in place of the
expected latin characters, "foo". Within a sentence that's easy to spot, but
what about "Ｏ" by itself, like "David Ｏ. Selznick"? [Cyrillic adds a host of characters](http://www.fileformat.info/info/unicode/block/cyrillic/utf8test.htm) very easily confused with latin text.

This issue has implications beyond the impersonation of people. Any time you
present a user-provided string to identify a given entity you run the risk of
"impersonating" that entity. That's a little too abstract, let's ask Network
Solutions and [PaypaI.com](http://paypai.com) … oh, [did I say PaypaI.com](http://www.zdnet.co.uk/news/security-management/2000/07/24/paypal-alert-beware-the-paypai-scam-2080344/)? In many fonts, including most browser
defaults, that's almost indistinguishable. With the introduction of
International Domain Names (IDN) there is a very real concern about this.
Where does gооgle.com go? Did you notice the two Cyrillic о's? Good news on
this front specifically is that [ICANN is more than aware of the issue and is on it](http://www.ripe.net/ripe/meetings/ripe-52/presentations/ripe52-dns-ican-idn.pdf).

## Bi-directional Phishing

As somebody who speaks a little Arabic, and generally geeks out about Unicode
and right-to-left this is a personal favorite. It turns out that in addition
to the built-in Unicode character direction there are also some characters for
explicitly controlling character direction. This is a case where adding
support for something produces some unexpected security issues. Packet Storm
Security has a great, easy to read [paper on the subject](http://packetstormsecurity.org/papers/general/righttoleften-override.pdf) [PDF].

By forcing the direction you can make 'foo' appear as 'oof', which seems
innocuous enough. Where things get interesting are when programs try to
augment text with auto-linking. I've been doing some Ruby on Rails work and
often times project use the auto_link() helper function. If a user provides
the text that is being passed into auto_link() to can end up with:

> auto_link("Change your password at #{[0x202E].pack('U')}http://MALWARE.COM/long/and/impressive/secure/looking/url/here/moc.knabitic.www://ptth")

Which in both Firefox and Safari looks like so:

![Displaying a malware link as Citibank]({{ site.url }}/assets/unicode-security/citibank.jpg)

Note that this still links to malware.com.

## Conclusion

Hopefully this was educational and not too dry. I recommend reading the
[Unicode Security Considerations](http://www.unicode.org/reports/tr36/)
document as well as the closely related [Unicode Security Mechanisms](http://www.unicode.org/reports/tr39/) document if you're
interested in other possible security issues. I didn't even touch on the lower
level buffer overflow errors in text processing … most people reading this are
using a sufficiently high level language such that they assume they can ignore
that.


