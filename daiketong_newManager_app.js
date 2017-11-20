var path = require('path');
var express = require('express');
var routes = require('./routes/index');
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 8084);
app.set('views', path.join(__dirname, 'views'));
var ejs = require('ejs');
app.engine('html', ejs.__express);
app.set('view engine', 'html');
routes(app);

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

