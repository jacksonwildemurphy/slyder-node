// This method does a very basic check to see if the provided email address is
// valid. Returns true if the provided email has the form x@x.x, where x can
// be of any length. The email parameter should be a string. Note, this will
// incorrectly identify some entries as true, such as:
// "somebody@somewhere@somewhereagain.something".

module.exports = function(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}