---
date: 2010-09-19 16:47:20
title: Grease Monkey programming for #NewTwitter

permalink: blog/grease-monkey-for-newtwitter/index.html
layout: post
---

So the new Twitter redesign (a.k.a. #NewTwitter) is out in the wild at last,
even if it's only a small percentage of users. Soon enough we'll all have
access but even before that I wanted to write about customizing #NewTwitter
using Grease Monkey. Much has been said about the new right side "Detail Pane"
real estate as a platform but I don't know about any of that. I suspect that
annotations and the Details Pane will be a match made in heaven but that's not
something I heard at the office, just my personal view as a former Platform
team member, and former 3rd party Twitter developer. What I'm interested in
_right now_ is customizing the Details Pane for myself using Grease Money.

  
I know that Twitter had to limit who they display content from for a myriad of
reasons. I'm not privy to the reasons but I know from the public discussion
around [previous blog posts](http://www.avc.com/a_vc/2010/04/the-twitter-platform.html) that Twitter is sensitive about injuring 3rd party developers.
When it comes to mash-ups, which is essentially what this is, most developers
I know would argue that any site with an open API is fair game. With that
moral relativism out of the way I'll get down to the business at hand.

## Adding a new media type

Maybe your you and your friends use an unsupported photo posting site. Maybe
it's video. Maybe it's something I haven't yet thought of. Whatever it is,
here is an example of adding a new media hosting site. This specific technique
works with any site providing content from a URL based on the short-url
component. For my example I'm using images from the image hosting site img.ly.
I'll start with a code listing and then break it down:

    
    // ==UserScript==
    // @name          Twitter Details Pane - Media Type support example
    // @namespace     http://mzsanford.com/
    // @description   Example script to display a spcific media type
    // @include       http://twitter.com/*
    // @include       https://twitter.com/*
    // ==/UserScript==  
    (function(){  
        window.addEventListener('load', function() {
          unsafeWindow.twttr.mediaType('twttr.media.types.Imgly')  
          .url('http://img.ly')
          .matcher(/\b(?:https?\:\/\/)?img\.ly\/(\S+)/g)  
          .icon('photo')  
          .process(function(slug, cb) {
            slug = slug.replace(/\/$/, '');
            this.data["id"] = slug;
            cb();
          })  
          .methods({
            html: function(cb) {
              var t = '<img src="http://img.ly/show/medium/{id}" />'
              cb(unsafeWindow.twttr.supplant(t, this.data));
            }
          });
        }, true);
    })();

I'm going to skip the Grease Monkey boiler plate and get right to line 11. You
can't call into the #NewTwitter Javascript environment until it's loaded (duh)
so I setup a window load handler to run my code. Now the magic begins. Using
some information [@hoverbird](http://twitter.com/hoverbird) [posted on GitHub](http://gist.github.com/584797) and Grease Monkey's unsafeWindow I was
able to execute my own Javascript code in the #NewTwitter environment. This
code uses Twitter's twttr.MediaType system to register a new URL pattern and
how it is displayed.

The  url() and matcher() functions seem pretty straight forward with the
additional note that parentheses in the matcher pattern can be accessed by the
process function. The icon() function takes one of three values: 'photo' (the
little picture), 'video' (which looks like film) and 'generic' (a little
generic page icon) and is displayed on the timeline. The process function is
run for the timeline entries and where you can stash away information found in
the URL match for later on. And lastly the html method (defined using this odd
methods({}) syntax) is where the actual data is rendered in the Details Pane.

If you had a JSONP API to work with you would want to make your call in the
html method since it called when the Detail Pane is rendered. Calling in the
process method would create a bunch of load on the other API for Tweets that
the user never clicks on. That's not how friendly neighbors work.

Hopefully that was at least a little helpful for developing Grease Monkey
scripts that work with #NewTwitter. I am also working on Details Pane
interaction without a timeline icon but that will have to wait for a future
post. If you have a suggested API to use for my next example (JSONP is
easiest) drop a comment at the bottom.
