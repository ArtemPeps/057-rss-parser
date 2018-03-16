var feed = require('feed-read');
var express = require('express');
var app = express();
var url = require('url');
var parse = require('url').parse;
var port = process.env.PORT || 5000;
var RssUrl = ["https://www.057.ua/rss"];
var count;
var css = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.0/css/foundation.min.css"> ';
css = css + '<style type="text/css">' + require('fs').readFileSync('./style.css').toString() + '</style>'



app.use('/news/:count', function (req, res) {
  res.write("<html>\n<head>\n<title>057 News Parser</title>\n<meta charset='utf-8'>\n" + css + "</head>\n<body class='container'>");
  count = req.params.count;
  for (var j = 0; j < RssUrl.length; j++) {
    feed(RssUrl[j], function (err, articles) {
      for (var i = 0; i < count; i++) {
        displayArticle(res, articles[i]);
        if (i === count - 1) {
          res.end("</body>\n</html>");
        }
      }
    });
  }
  function displayArticle(res, a) {
    var author = a.author || a.feed.name;
    var sliced = a.content.slice(0, 500);
    var image = a.enclosure;

    if (sliced.length < a.content.length) {
      sliced += '...' + "<a href='" + a.link + "'>Продолжение в источнике</a>";
    }
    res.write('<div class="jumbotron">')
    res.write("<h3>" + "<a href='" + a.link + "'>" + a.title + "</a>" + "</h3>");
    res.write("<img src='" + image + "'>");
    res.write("<p><strong>" + author + " - " + a.published + "</strong> <br />\n");
    res.write(sliced + "</p> </div>\n");
  }
});

app.listen(3000, function () {
  console.log('listening on port 3000!');
});

