
var PostPath = __dirname + '/../posts/';
var fs = require('fs');
var markdown = require("markdown").markdown;
var dateFormat = require('dateformat');

// Date formatting additions to Date
require('date-utils');

var blogPosts = {
  byName: {},
  directory: [],
  getPosts: function() {
    var now = new Date();
    return this.directory.filter(function(x){ if (x.date < now) { return x; } });
  }
};

fs.readdir(PostPath, function(err, files) {
  files.forEach(function(file) {
    var parts = file.split(/\./);
    if (parts[1] == "markdown") {
      var raw = fs.readFileSync(PostPath + file, "utf-8");
      var data = raw.split(/\n\n/);
      var obj = {};
      data.shift().split(/\n/).forEach(function(mdRow) {
        var m = mdRow.match(/^(\w+): (.*)$/);
        if (m) {
          var k = m[1].toLowerCase();
          if (k == "date") {
            obj[k] = new Date(m[2]);
          } else {
            obj[k] = m[2];
          }
        }
      });
      obj.name = parts[0];
      obj.snippet = markdown.toHTML(data[0]);
      obj.body = markdown.toHTML(data.join("\n\n"));
      
      if (obj.storify) {
        obj.body += "<h2 class=\"comments\">Comments on this post</h2>"
                 +  "<script src=\"" + obj.storify + ".js?header=false\"></script><noscript>[<a href=\"" +
                                       obj.storify + "\" target=\"_blank\">View the story \"Comments on Agile Patent Reform\" on Storify</a>]</noscript>";
      }  

      blogPosts.byName[obj.name] = obj;
      blogPosts.directory.push(obj);
    }
  });

  // Date ordered directory
  blogPosts.directory.sort(function(a,b) {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  });
});

var requestHost = function(req) {
	return req.header('Host').split(/:/)[0];
};

/* Re-used route definition */
var blogMain = function(req, res) {
  res.render('blog', {
    title: false,
    posts: blogPosts.getPosts(),
    bodyClass: 'blog-main'
  })
};

var notFound = function(req, res) {
  res.send("Not the droid you're looking for.", 404);
};


/*
 * GET home page.
 */
module.exports = {
  
  index: function(req, res) {
    if (requestHost(req).match(/^blog/)) {
      blogMain(req, res);
    } else {
      res.render('index', { title: false, bodyClass: 'index' });
    }
  },
  
  blogMain: blogMain,
  
  feed: function(req, res) {
    res.render('feed', {
      title: false,
      posts: blogPosts.getPosts(),
      layout: false,
      dateFormat: dateFormat
    })
  },
  
  blogPost: function(req, res) {
    var post = blogPosts.byName[req.params.post];
    
    if (post === undefined) {
      notFound(req, res);
    } else {
      res.render('blog/post', {
        content: post.body,
        title: post.title,
        date: post.date,
        bodyClass: 'long-form blog-post'
      });
    }
  },
  
  resume: function(req, res) {
    res.render('resume', { layout: false });
  }
};