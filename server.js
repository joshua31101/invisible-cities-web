const express = require("express"),
      bodyParser = require('body-parser'),
      url = require('url'),
      app = express(),
      port = process.env.PORT || 5000,
      session = require('express-session'),
      routes = require('./routes');
      // firebase = require('./controllers/firebaseController');

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

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static(__dirname + '/public'));

// app.use(function(req, res, next) {
//   const currentUrl = url.parse(req.url).pathname;
//   res.locals.hasLoggedIn = 0;
//   if (firebase.hasLoggedIn()) {
//     res.locals.hasLoggedIn = 1;
//     if (currentUrl === '/login') {
//       return res.redirect('/');
//     }
//   } else if (currentUrl !== '/login') {
//     return res.redirect('/login');
//   }
//   next();
// });

// app.use(require('./controllers'));

// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

app.use('/api', routes);

app.listen(port, () => {
  console.log('listening on http://localhost:' + port);
});
