---
title: Thoughts on Node.js
date: 2012-04-24 15:30:00
permalink: blog/thoughts-on-node/index.html
layout: post
---

I've made fun of Node and argued against its use in a production environment. I've questioned its architecture and its entire reason for being. I've mocked the brogrammers hocking it as magic scaling sprinkles (as I did to the Erlang proponents before them). My main issue with Node at the start was that it had simply not been tested to withstand the type of abuse a high-scale production site would put on it. Now that I don't work on a high scale, performance critical site I can take a step back and read up on some of the things I've been shunning all of these years.

I've been working on a simple site to get familiar with Node (this site, in fact). I've also been looking at Node from the C++ side via my work on [libcld](https://github.com/mzsanford/cld). Like many programmers I've been watching the Node pro/con blog posts and Tweets and reading the various arguments for and against Javascript as a server side language. Of course, server side Javascript was much touted once before and went nowhere. Now we're looking at a more performant variety and a better included library of functionality. I decided to take a few minutes and write down my thoughts on Node.

## What Node Lacks

**Node lacks history** and that's still my main hesitation. As a new runtime with a short history there is a lack of good information on how to tune and troubleshoot Node. There is also a proliferation of solutions to very common problems with no clear guidance as to the best practices. This is true of every new language or runtime (I've personally faced it in Scala as well) but it is still something that hinders adoption.

One of the selling points of Node in many circles is the ability to share code with the client side. I think that drum has been beaten much too loudly. While **some code can be shared with the client side I don't think that's the main gain** to be had from Javascript on the server side. Continuing to sell Node on this is only going to create a class of people who hate Node because they were once on a project with this goal and were sorely disappointed. Sharing non-trivial Javascript between the server and client is rarely useful, and the trivial stuff is hardly a gain big enough to justify a choice of programming language or runtime.

The other major selling point I've heard from Node adherents is that it improves hiring woes by using a single language. While I can see where that seems right at first sniff it's not that simple. Javascript in a browser environment has many different concerns than Javascript running on a single version of Node under your control. Hiring a stable of programmers who can do it all also ignores that most Javascript written in the browser is interacting with the DOM. DOM interaction is tricky and I want someone who knows what the hell they are doing, not someone who knows the Node +EventEmitter+ forward and backwards but breaks the page on 50% of browsers. Conversely, I don't think years of experience on the quirks of [window.location.hash assignment](http://mzsanford.com/blog/sufferin-safari-version-quirks) qualify someone to dig in and work on some Node +fs+ library troubleshooting. Sure, the uptake should be quicker but it's more like moving from writing GUIs with QT and C to writing server software in C. The language knowledge helps but the **syntax is the easy part – the framework knowledge is the true value**.

## What Node Brings

Javascript as a language is very heavily dependent on callbacks. This is sometimes seen as a problem on the server side but it underpins Javascript's major benefit. The callback paradigm Javascript uses is key to the Node **single threaded, asynchronous by default** design. Both of those are important and I want to talk about each in turn.

### Single Threaded

Concurrency problems are notoriously difficult to debug. It seems that the main problem is that in a program of any reasonable complexity it becomes impossible to reason about every possible concurrency interaction. Many of us try to. Much of the time we think we have a handle on it. But as time goes on I'm more and more convinced I'm just getting lucky on these. Worst of all, concurrency issue often only fail in production, under heavy load, when we can least tolerate failure. Running in a single thread removes this problem.

Some problems are scaled vertically but it's become clear over the years that these solutions are just buying time and that horizontal scalability is a more robust path. Adding threads to a program is taking the vertical scalability approach where more, low-overhead processes running in parallel (possibly on different machines) is the very definition of horizontal scalability.

At first glance the process management issues this creates seem like the kind of thing dev-ops teams go batshit over. Realistically, if you're doing anything of a reasonable size and complexity those types of problems already have to be solved. Even better: those problems have been solved and your dev-ops team probably already has a solution the know how to use and monitor effectively.

### Asynchronous by Default

Most programs spend the lion's share of their time blocking on I/O of some sort. While you can go single threaded alone the amount of time spent waiting on I/O translates into wasted resources. The ability to use these "waiting" cycles (e.g. using your CPU while you wait for your disk to spin) is the key to greater efficiency. None of that is earth shattering but very few programs take advantage of it. For example, that last great web framework (Rails) ran as a single thread that spent tons of time in I/O wait. If we know asynchronous I/O can produce huge efficiency gains why aren't we doing it? Well, probably because our mainstream programming languages use synchronous I/O by default.

If you've ever used Java's NIO package you know that adding asynchronous I/O into a language otherwise built around standard, synchronous I/O is painful. If you've written Java and not used NIO then you have proved my point. The NIO package was added in Java 1.4 and while everyone can agree that blocking I/O is the enemy of efficiency very few programs use NIO – and even fewer use it flawlessly.

In Javascript we have a language that is designed to be asynchronous because it's designed to handle the unpredictability of human UI interaction. In Node's standard library we have core I/O interfaces that are asynchronous by default. This change helps **make doing the right thing easy**, and that is a core problem that needs to be solved to succeed. If asynchronous is not the default you will always be correcting where someone did something the easy way rather than the performant way. The performant way needs to be the easy way.

## Where That Leaves Me

The combination of single-threaded processes using asynchronous I/O is nothing new. My first technology job was with AOL and the "SAPI" library at AOL was a framework for these same restrictions when building C programs. Before that AOL had similar PL/I libraries using X.25. You can discount AOL but at the time (late 90's) the scale was impressive and it was being done with ease in many cases.

I don't think people have the ability to reason about the interaction of multi-threaded programs of moderate complexity. That's not to say I won't try again in the future, but I think the human mind will be a fundamental limit to how far we can scale in-process concurrency. The future is horizontally scaled. I think we'll need to embrace a language that has asynchronous I/O as the default. If Javascript will be that language, and Node the runtime, I don't know. It stands a pretty damn good chance right now.
