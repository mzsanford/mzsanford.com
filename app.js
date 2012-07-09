
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use("/scholarship", express.static(__dirname + '/scholarship'));
  app.use('/blog', express.static(__dirname + '/posts'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('*', function(req, res, next){ 
  if (req.headers.host.match(/^scholarship/)) {
    req.url = '/scholarship' + req.url;  //append some text yourself
  }
  next(); 
});

// Routes
app.get('/', routes.index);
app.get('/resume', routes.resume);
app.get('/blog', routes.blogMain);
app.get('/blog/:post', routes.blogPost);
app.get('/feed.atom', routes.feed);


app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
