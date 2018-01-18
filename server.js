const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const http = require("http");
const port = process.env.PORT || 5000;
const webServer = http.createServer(app).listen(port);

app.use(require('./controllers'));

webServer.listen(port, function () {
  console.log('listening on http://localhost:' + port);
});

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}
