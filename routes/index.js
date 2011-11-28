
var fs = require('fs');

var requestHost = function(req) {
	return req.header('Host').split(/:/)[0];
};

/*
 * GET home page.
 */

exports.index = function(req, res) {
  if (requestHost(req).match(/^blog/)) {
    res.render('blog', { layout: false });
  } else {
    res.render('index', { title: 'Matt Sanford' });
  }
};

/*
 * GET blog pages
 */
exports.blog = function(req, res) {
  res.render('blog', { layout: false });
};
