const express = require("express"),
      bodyParser = require('body-parser'),
      app = express(),
      http = require("http"),
      port = process.env.PORT || 5000,
      webServer = http.createServer(app),
      session = require('express-session');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  // Cookie Options
  duration: 24 * 60 * 60 * 1000,// 24 hours
}));

app.use(express.static(__dirname + '/public'));
app.use(require('./controllers'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

webServer.listen(port, function () {
  console.log('listening on http://localhost:' + port);
});

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
