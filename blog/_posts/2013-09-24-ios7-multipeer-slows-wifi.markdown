---
date: 2013-09-24 11:00:00
title: iOS 7 Multipeer Browsing Causes Wi-Fi Congestion

permalink: blog/ios7-multipeer-wifi-slow/index.html
layout: post
---

While working with the new iOS 7 [Multipeer Connectivity Framework](https://developer.apple.com/library/ios/documentation/MultipeerConnectivity/Reference/MultipeerConnectivityFramework/Introduction/Introduction.html) the project I was working on started experiencing a very large increase in network timeouts. Stranger still was that these timeouts were exclusively while connected to Wi-Fi. Turning off the Multipeer functionality solved the problem so I started doing some more detailed testing.

## The Suspected Cause

The [Multipeer Connectivity Framework Introduction](https://developer.apple.com/library/ios/documentation/MultipeerConnectivity/Reference/MultipeerConnectivityFramework/Introduction/Introduction.html) says:

> “The Multipeer Connectivity framework provides support for discovering services provided by nearby iOS devices using infrastructure Wi-Fi networks, peer-to-peer Wi-Fi, and Bluetooth personal area networks and subsequently communicating with those services by sending message-based data, streaming data, and resources (such as files).”

Multipeer is using Wi-Fi at the same time the app is attempting a rather sizable download. This sort of suspicion is easily confirmed.

## Simplest Reproducible Test Case

The original app I was playing with was using both Multipeer browsing and advertisement. Based on the use case I could re-factor to do one or the other more often so it was worth knowing which is the Wi-Fi hog. It was also helpful to quantify the problem. I put together a [very simple test app](https://github.com/mzsanford/MZSMultipeerTest) that presents a UI for enabling/disabling the two Multipeer modes (advertising and browsing) and downloads a file over HTTP to test the effect on download speed. Here were my findings:

![Multiple runs, multiple configurations]({{ site.url }}/assets/ios7-multipeer-wifi-slow/runs.png)

For my test the file downloaded is from a local host via Bonjour/HTTP and served using [serve](https://github.com/jlong/serve). The main purpose of this was to test the speed of downloads with and without Multipeer and not the speed of the network and/or server. To try and control for some external variables I ran each download from the same device (iPhone 5) on the same network in the same physical position. I also ran 7 downloads for each configuration so I could get some sense of an average.

## The Verdict

The chart below shows the maximum download speed for each configuration with a vertical mark on the average speed for the 7 runs. Based on the average and maximum you can see that there is a very small throughput penalty for Multipeer advertisement but a very large penalty for browsing. As browsing is a more active task that was expected. What was unexpected was the nearly 50% degradation.

![Aggregate observations]({{ site.url }}/assets/ios7-multipeer-wifi-slow/results.png)
