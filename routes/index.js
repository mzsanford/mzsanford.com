
var fs = require('fs');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Matt Sanford' })
};

/*
 * GET blog pages
 */
exports.blog = function(req, res) {
  res.render('blog', { layout: false });
};
