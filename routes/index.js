//using passportJS to handle social Google+ login
var express = require('express');
var passport = require('passport');
var router = express.Router();

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
}

 // Get the home login page of the application
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cloud Services Assignment 1', env: env });
});

router.get('/login',
  function(req, res){
    res.render('login', { env: env });
  });

//use middleware Multer for handling file uploading
//use mime for getting full file names for extensions
var multer  =   require('multer');
var app     =   express();
var mime    =   require('mime');
var storage =   multer.diskStorage({

  //store uploads in an uploads folder on the server
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  //rename the uploaded file randomly with the associated extension
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
  }
});
//store as a single file
var upload = multer({ storage : storage}).single('userPhoto');


//call path and render upload.jade
router.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {

          return res.send("Error uploading file.");
        }
        //send all file details to the upload page
        res.render('upload', { upload: req.file });

        console.log(req.file);
    });
});

//logout user and redirect to login page
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//get token from auth0 for social login
router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/user');
  });



module.exports = router;
