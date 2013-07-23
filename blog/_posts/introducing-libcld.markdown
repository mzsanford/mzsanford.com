Date: 2012-01-12 15:44:00
Title: Introducing libcld
Author: Matt Sanford

I'm thrilled to announce `libcld`, a stand-alone C++ library for the [Chromium Compact Language Detector](http://code.google.com/codesearch#OAMlx_jo-ck/src/third_party/cld/encodings/compact_lang_det/). As someone who works mostly in higher level languages I'm also thrilled to say that bindings for Ruby, Python and Node are also included with Java coming soon. This is based on the awesome work by [Mike McCandless](http://blog.mikemccandless.com/) who [extracted the CLD code]( http://code.google.com/p/chromium-compact-language-detector/) and wrote the Python bindings. I've since focused on an improved build configuration, higher level language bindings and a [Homebrew](http://mxcl.github.com/homebrew/) formula. Read on for an introduction to installing and using `libcld`.

### Installation

**WARNING:** Before installing any of the ports you **MUST** install the C++ library.

#### Installing the C++ Library (**required**)

On Mac OS X using Homebrew it's as simple as:

    $ brew install https://raw.github.com/mzsanford/homebrew/libcld/Library/Formula/libcld.rb

Other Linux (or if you are on Mac OS X and don't use Homebrew) you can install from source:

    $ git clone http://github.com/mzsanford/cld.git
    $ cd cld
    $ ./configure && make
    $ make check # test early. Test often.
    $ make install

On Windows:

There is a [Visual Studio Project file](https://github.com/mzsanford/cld/blob/master/cld.vcxproj) created by [@yitzikc](https://github.com/yitzikc). I am personally unable to confirm if it works but if someone can confirm it and send brief instructions I'll include them here.

#### Installing the Ruby bindings

**Before installing any language binging you MUST first install the C++ library. (see above)**

*Note: This is similar to the default [CLD gem](https://github.com/jtoy/cld), which includes the C++ library. The main difference is that this version uses a shared library and provides a more complete result structure.*

    $ git clone http://github.com/mzsanford/cld.git
    $ cd cld/ports/ruby
    $ rake gem
    $ gem install pkg/*gem
    
#### Installing the Node bindings

**Before installing any language binging you MUST first install the C++ library. (see above)**

*Note: This is similar to the [@dachev/cld](https://github.com/dachev/cld) project with the exception of using a shared library and providing an asynchronous interface.*

    $ git clone http://github.com/mzsanford/cld.git
    $ cd cld/ports/node
    $ node-waf configure build
    $ npm install

#### Installing the Python bindings

**Before installing any language binging you MUST first install the C++ library. (see above)**

*Note: Python bindings were included in the original project and have only been refactored to fit into the new build system*

    $ git clone http://github.com/mzsanford/cld.git
    $ cd cld/ports/python
    $ make install # This will prompt for your password

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

The Python API works like so:

    import cld
    
    detectedLangName, detectedLangCode, isReliable, textBytesFound, details = cld.detect("This is my sample text", pickSummaryLanguage=True, removeWeakMatches=False)
    print '  detected: %s' % detectedLangName
    print '  reliable: %s' % (isReliable != 0)
    print '  textBytes: %s' % textBytesFound
    print '  details: %s' % str(details)
    
    # The output look lie so:
    #  detected: ENGLISH
    #  reliable: True
    #  textBytes: 25
    #  details: [('ENGLISH', 'en', 64, 20.25931928687196), ('FRENCH', 'fr', 36, 8.221993833504625)]      

I do not yet have any benchmarks for the Python bindings but I expect them to be in-line with all of the other simple, synchronous bindings.

### Next Steps

The Java/JNI interface is working and I am currently working on improving the build system to make it more usable. Any help would be welcome but with luck it will be done soon.

I need help with:

* More autotools configuration improvements by someone who knows it better
* Python bindings need some love
* MOAR BINDINGS
 * I know Perl so I may go that route
 * I would love to see community help on PHP.
 * Other possibilities (in no particular order):
   * CLR/.NET
   * Scala facade to java API
   * Objective-C
   * Other languages?
   * Go wild and make a browser plugin version of the JS API? That would be insane!
