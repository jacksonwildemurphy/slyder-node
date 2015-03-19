/* This file is the entry point for the Liyen website */

var express = require("express");
var app = express();
var credentials = require("./credentials.js");
var isValidEmail = require("./lib/validate-email.js");
app.set("port", process.env.PORT || 3000);


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


// Connect to our database
var mongoose = require("mongoose");
var options = {
    server: {
        socketOptions: {
            keepAlive: 1 // helps prevent connection errors
        }
    }
};

switch (app.get("env")) {
    case "development":
        mongoose.connect(credentials.mongo.development.connectionString, options);
        break;
    case "production":
        mongoose.connect(credentials.mongo.production.connectionString, options);
        break;
    default:
        throw new Error("Unknown execution environment: " + app.get("env"));
}

// Import database models
var Subscriber = require("./models/subscription.js");

// Test: Adding a sample subscriber to the database


console.log("Success");


// Add the 'static' middleware
app.use(express.static(__dirname + '/public'));

// Add the body parser for handling form submissions
app.use(require("body-parser")());


/// ROUTES


// Route to the home page
app.get("/", function(req, res) {
    res.render("home");
});

// Route for the subscription-form submission
app.post("/process-subscription", function(req, res) {
    // TODO Save data to database and/or do other processing here
    var success = false,
        userArray = req.body.multiselect,
        isAsthmatic = false,
        isRelative = false,
        isInvestor = false,
        i = 0;

    // Add subscriber to the database if the email is valid
    if (isValidEmail(req.body.email)) {
        success = true;

        // process the checkboxes
        if ((typeof userArray) !== "undefined") {
            while (i < userArray.length) {
                if (userArray[i] === "1")
                    isAsthmatic = true;
                else if (userArray[i] === "2")
                    isRelative = true;
                else
                    isInvestor = true;
                i++;
            }
        }

        new Subscriber({
            email: req.body.email,
            date: new Date(),
            asthmatic: isAsthmatic,
            relative: isRelative,
            investor: isInvestor
        }).save();
    }

    // Check whether browser prefers to receive JSON or HTML
    if (req.xhr || req.accepts("json,html") === "json") {
        // TODO If there was a db error, send {error: "error description"}
        // If there was not a db error:
        res.send({
            success: success
        });
    } else { // fallback if AJAX doesn't work
        // TODO: If there was a db error, send and error msg or redirect to error page
        // If there was not a db error:
        res.redirect(303, '/');
    }

});

// Route for the contact-form submission
app.post("/process-contact", function(req, res) {
    // TODO: Save data to database and/or do other processing here

    console.log("Email: " + req.body.email);
    console.log("Subject: " + req.body.subject);
    console.log("Message: " + req.body.message);

    // Check whether browser prefers to receive JSON or HTML
    if (req.xhr || req.accepts("json,html") === "json") {
        // TODO: If there was a db error, send {error: "error description"}
        // If no error:
        res.send({
            emailMessage: "",
            subjectMessage: "",
            messageMessage: ""
        });
    } else {
        // TODO: If there was a db error, send and error msg or redirect to error page
        // If no db error:
        res.redirect(303, '/');
    }
})


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