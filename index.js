var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/static'));

app.get('/', function(request, response) {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.end(fs.readFileSync('./static/index.html'));
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
