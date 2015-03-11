// **This file is the entry point for the Liyen website**

var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);


// Set up the handlebars view engine, set the layout to main.handlebars, and
// add a helper for section views.
var handlebars = require('express3-handlebars')
    .create({
        defaultLayout: 'main',
        helpers: {
            section: function(name, options) {
                if (!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            }
        }
    });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


// Add the 'static' middleware
app.use(express.static(__dirname + '/public'));


// /// ROUTES


// // Route to the home page
// app.get('/', function(req, res) {
//     res.render('home');
// });


/// ERROR HANDLERS

// 404 catch-all handler
app.use(function(req, res) {
    res.status(404);
    res.render('404');
});
// 500 error handler
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


/// START THE APP

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port'));
});