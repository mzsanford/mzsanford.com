---
date: 2011-06-17 17:38:41
title: R2rb - Mirroring CSS direction

permalink: blog/r2rb-mirroring-css-direction/index.html
layout: post
---

I'm proud to announce the release of what is possibly the smallest Ruby gem
I've ever worked on, [R2](https://github.com/mzsanford/r2rb)
([R2rb](https://github.com/mzsanford/r2rb) on github, simply
[r2](http://rubygems.org/gems/r2) on rubygems.org). Anybody who has read my
older posts knows that I'm interested in Arabic, and more specifically Arabic
information processing. While talking about something unrelated I found out
that [Dustin Diaz](http://dustindiaz.com) has written a Node.js module called
[R2](https://github.com/ded/r2) for mirroring the appropriate CSS values
needed to alter the directionality of a page. While this isn't a silver bullet
it does do a very good job on pages that have successfully separated
presentation from markup (read as: don't use inline CSS styles).

## Details …

The code itself is shockingly simple but effective. Dustin already has an
example built into his website. Here is the normal page (emphasis added to the
demo link):

![dustindiaz.com as seen by default]({{ site.url }}/assets/r2rb-mirroring-css-direction/ltr.jpg)

When you click the demo link (pointed to with the **Click Me.** label) there
is a small amount of Javascript that alters the link tag to point the the CSS
file that R2 has processed. The resulting page shows the CSS direction change
with zero customization:

![dustindiaz.com as seen after clicking the arrow]({{ site.url }}/assets/r2rb-mirroring-css-direction/rtl.jpg)

While this is obviously not everything one needs to do for right-to-left
support (of note above are the Twitter follow buttons) it's a good starting
point. If you have a large CSS file to start with the alterations can be
daunting. I recommend using R2 and then troubleshooting the remaining bugs. I
created a Ruby port of R2 in part to improve my understanding of R2 and in
part in the hopes of using it in some future Rails project.
