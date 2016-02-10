var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
var router = express.Router();

//ensure the user is logged in on the '/' path
router.get('/', ensureLoggedIn, function(req, res, next) {
	//render user.jade file and send all user details
	res.render('user', { user: req.user });
    console.log(req.user);

 ////////////////////////////COUCHDB////////////////////////////////////////////////

 	var nano = require('nano')('http://localhost:5984');

	
	// create a new database
    nano.db.create('webkitdemo', function() {
      // specify the database name
	    var webkitdemo = nano.use('webkitdemo');
	    // and insert users names who have accessed system into couchDB
	    webkitdemo.insert({crazy:true}, req.user.displayName, function(err, body, header) {
	      if (err) {
	        console.log('[webkitdemo.insert] ', err.message);
	        return;
	      }
	      console.log('you have inserted the name.')
	      console.log(body);
        });
    });
});

module.exports = router;