// Database model for people who subscribe to the newsletter

var mongoose = require("mongoose");

var subscriberSchema = mongoose.Schema({
    email: String,
    date: Date,
    asthmatic: Boolean,
    relative: Boolean,
    investor: Boolean
});

var Subscriber = mongoose.model("Subscriber", subscriberSchema);

module.exports = Subscriber;