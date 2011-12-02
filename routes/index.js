
var PostPath = __dirname + '/../posts/';
var fs = require('fs');
var markdown = require("markdown").markdown;

var blogPosts = {
  byName: {},
  directory: []
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

/*
 * GET home page.
 */
module.exports = {
  index: function(req, res) {
    if (requestHost(req).match(/^blog/)) {
      blogMain(req, res);
    } else {
      res.render('index', { bodyClass: 'index' });
    }
  },
  
  blogMain: function(req, res) {
    res.render('blog', {
      posts: blogPosts.directory,
      bodyClass: 'blog-main'
    });
  },
  
  blogPost: function(req, res) {
    var post = blogPosts.byName[req.params.post];

    res.render('blog/post', {
      content: post.body,
      title: post.title,
      date: post.date,
      bodyClass: 'long-form blog-post'
    });
  }
};