Date: 2012-09-30 11:00:00
Title: Scatter/Gather HTTP in Ruby
Author: Matt Sanford

In a system the depends on multiple other remote systems (as is common in a
service oriented architecture) it's often necessary to make multiple requests
and combine the results. The simplest possible code for this makes each request
in serial, one after the other, and combines the results. This is easy to write
and easy to understand but scales poorly. It seems that everybody can agree that
a parallel scatter/gather approach is more scalable but it seems like there is
a lack of Ruby examples of the pattern.

I have seen some examples of scatter/gather that use [Ruby EventMachine](http://rubyeventmachine.com)
but they are all very EventMachine specific. They work on the assumption that
your entires application is running as a reactor patterned network service.
While that's a fine choice for a greenfield project architecture it's not the
most common use of Ruby. I wanted to try using EventMachine for a Ruby parallel
scatter/gather pattern that is accessible through a simple interface suitable
for use within a Rails application (or any other single-threaded framework). The
result is the following sample code and benchmark (description to follow):

## Benchmarking Scatter/Gather Code

<script src="https://gist.github.com/3803158.js?file=em-http.rb"></script>

The results are something like this:

           user     system      total        real
     iter:  0.030000   0.010000   0.040000 (  1.972087)
    em-sg:  0.020000   0.010000   0.030000 (  0.794546)

And if somehow there is a slow response (or if I lower the timeout), you get the
following:

           user     system      total        real
     iter:  0.030000   0.010000   0.040000 (  1.780102)
    em-sg:Returning 4 of 5 results : ["http://google.com", "http://twitter.com/404.html", "http://twitter.com/500.html", "http://twitter.com/502.html"]
      0.010000   0.010000   0.020000 (  0.210129)

Of course, the calling code needs to handle partial results. In any system built
on multiple others that must be handled. At least in this case there is a way
to get to that state quicker and in parallel.

## Code Walkthrough

Most of the code should be self explanatory but I wanted to cover some
highlights. The `Interatred` class shows the simplest approach and does not
need much explanation. It's as simple as iterating through the URLs and making
the requests in order. The `ScatterGather` class is where the interesting work
take place.

The `EventMachine.run` call starts the event loop which will block until
something calls `EventMachine.stop`. Failing to call `EventMachine.stop` will
result in your code hanging so it's important to be sure it always gets called.
A good way to make sure it is called it to set a maximum timeout, which is what
the `EventMachine.add_timer` call is doing. If the event loop hasn't finished in
`timeout` seconds the timer will stop the event loop, causing the `run` method
to return whatever results it has.

The `EventMachine::MultiRequest` class allows for multiple concurrent HTTP
requests but will only call the `#callback` when they have all completed. In the
success case that's exactly what happens. When only some requests return in time
the `MultiRequest#callback` does not get called. To make sure that we can return
partial results the `HttpRequest#callback` is set on each individual request. The
`MultiRequest#callback` is only used to signal that all requests have completed
before the timeout and stop the event loop.

## Conclusion

Of course in the real world the class wouldn't just take a list of URLs and a
timeout, but would combine the results in some way. Having said that, the simple
`ScatterGather` class could easily be used directly as a simple drop-in
replacement in simple cases. This is nothing revolutionary but a simple Google
search for examples like this came up empty so I thought I'd drop a few
breadcrumbs for the next person.
