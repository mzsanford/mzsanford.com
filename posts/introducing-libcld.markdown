Date: 2012-01-12 15:44:00
Title: Introducing libcld
Author: Matt Sanford

I'm thrilled to announce `libcld`, a stand-alone C++ library for the [Chromium Compact Language Detector]. As someone who works mostly in higher level languages I'm also thrilled to say that bindings for Java, Ruby, Python and Node are also included. This is based on the awesome work by [TODO: need name] who extracted the CLD code and wrote the Python bindings. I've since focused on an improved build configuration, higher level language bindings and a [Homebrew] formula. Read on for an introduction to installing and using `libcld`.

### Installation

On Mac OS X using Homebrew it's as simple as:

    $ brew install libcld

Other Linux or if you are on Mac OS X and are morally opposed to Homebrew you can install from source:

    $ git clone http://github.com/mzsanford/cld.git # todo: tar download?
    $ cd cld
    $ ./configure && make
    $ make check # test early. Test often.
    $ make install

I'm not sure about Windows yet as I haven't had the opprotunity to test it.

### Library Overview

note: concepts and return values that are shared across languages. 

### API Examples

Presented in a order from the languages I know the best or have the most recent experience with to those I barely know.

#### Ruby

There are full [RDocs hosted by github](http://mzsanford.github.com/cld/ports/ruby/rdoc/index.html) but an example usage looks like this:

    require 'CLD'
    require 'pp' # just for illustration
    
    cld = CLD::Detector.new
    res = cld.detect_language('I am the very measure of a modern major general')
    
    pp res
    #<CLD::LanguageResult:0x007fb7728b6768
     @possible_languages=
      [#<CLD::PossibleLanguage:0x007fb7728b6628
        @language=#<CLD::Language:0x007fb7728b66a0 @code="en", @name="ENGLISH">,
        @raw_score=100.0,
        @score=52.6742301458671>],
     @probable_language=
      #<CLD::Language:0x007fb7728b6740 @code="en", @name="ENGLISH">,
     @reliable=0>

You can also run benchmarks from the `ports/ruby` directory with `rake benchmark`. I'll do a future post on the benchmarks.

#### Java

TODO: Finish and add an example.

#### Node

The Node API looks like this:

    var LanguageDetector = require('languagedetector').LanguageDetector;
    var detector = new LanguageDetector();
    
    // Sync - Returns two letter language code of the most likely candidate language
    var simpleResult = detector.detectSync("This is my sample text");
    // Returns 'en' in this case
    
    // Async - Returns detailed result structure
    detector.detect("This is my sample text", function(result) {
      // 'result' contains:
      // { languageCode: 'en',
      //  reliable: false,
      //  details: 
      //   [ { languageCode: 'en', normalizedScore: 20.25931928687196, percentScore: 64 },
      //     { languageCode: 'fr', normalizedScore: 8.221993833504625, percentScore: 36 },
      //     { languageCode: 'un', normalizedScore: 0, percentScore: 0 } ] }
    });

You can run the benchmarks from the `ports/node` directory with `node benchmark.js`. The results on my Macbook Pro are:

    Create#test x 258,229 ops/sec ±5.38% (54 runs sampled)
    Reuse#test x 397,704 ops/sec ±2.51% (56 runs sampled)
    ReuseAsync#test x 51,061 ops/sec ±0.38% (61 runs sampled)
    Fastest is Reuse#test

Let me decode that. You can do simple detection (just two letter codes, synchronously) at about 397,000 per second.
Complete results via the async method run at 51,000 per second. That's pretty damn fast.

#### Python

TODO: Example.

### Next Steps

Note: More work on API and docs.

I need help with:

* Improved autotools configuration by someone who knows it better
* Python bindings need some love
* MOAR BINDINGS
 * I know Perl so I may go that route
 * I would love to see community help on PHP. CLR/.NET? Scala facade to java API? Other languages? Go wild and make a browser plugin version of the JS API? That would be insane!
