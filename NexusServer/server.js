// set up ======================================================================
// Core service modules.
var express = require('express'),
    app = express(),

    child = require('child_process'),
    https = require('https'), // building an https server.
    fs = require('fs'), // file system core module
    path = require('path'),
    mysql = require('mysql'),
    passport = require('passport'), // authentication middleware.

    // middleware modules.
    logger = require('morgan'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    flash = require('connect-flash'),

    // scraper modules.
    // request = require('request'),
    // cheerio = require('cheerio');

    configDB = require('./config/database.js'); // load db configuration.

// configuration ===============================================================
var db_connection = mysql.createConnection({
    host: configDB.host,
    user: configDB.user,
    pass: configDB.pass
});

require('./config/passport')(passport, db_connection); // load passport configuration.

app.use(logger('dev')); // log every request.
app.use(cookieParser()); // parse cookies, used for authentication.
app.use(bodyParser()); // grab arguments from post requests.
app.use(express.static(path.join(__dirname, 'public'))); // files inside public/ are served staticly.
// app.use(express.favicon(__dirname + '/public/favicon.ico'));
app.use(session({
    secret: 'nexiansgetallthegirls'
})); // set the session secret.
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions.
app.use(flash()); // use connect-flash for flash messages stored in session.

app.use(express.errorHandler()); //have to load as dependency

// child processes initialization ==============================================



// routes ======================================================================
require('./app/routes.js')(app, passport, db_connection); // load our routes and pass in our app and fully configured passport


// launch ======================================================================
http.createServer(app).listen(80);
https.createServer({
    key: fs.readFileSync("35215954_snf-537077.vm.okeanos.grnet.gr.key"),
    cert: fs.readFileSync("35215954_snf-537077.vm.okeanos.grnet.gr.cert")
}, app).listen(443);
