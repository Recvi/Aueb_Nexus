module.exports = function(app, passport, db_connection) {

    // middleware and helper functions =========================================
    // Define a middleware function to be used for every secured routes.
    var auth = function(req, res, next) {
        if (!req.isAuthenticated())
            res.send(401);
        else
            next();
    };

    // Method that redirects to HTTPS.
    app.use(function requireHTTPS(req, res, next) {
        if (!req.secure) {
            //FYI this should work for local development as well.
            return res.redirect('https://' + req.get('host') + req.url);
        }
        next();
    });

    // authorization routes ====================================================
    app.get('/profile', auth, function(req, res) {

    });
    // Update Feeds.
    app.get('/update/eclass', auth, function(req, res) {
        // db_connection.connect();
        // db_connection.query('SELECT p.postID, p.title, p.publicationDate, p.deadlineDate, p.content, p.type, p.courseID, p.postUrl FROM `EclassPosts` WHERE ');
        // send message to scraper to bring data.
        eclass_scraper.send(req.user);
        eclass_scraper.once('message', function(reply) {
            req.user = reply;
            res.send(req.user);
        })

    });
    app.get('/update/mail', auth, function(req, res) {

    });
    app.get('/update/venus', auth, function(req, res) {

    });
    // route to test if the user is logged in or not.
    app.get('/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });
    // Login routes.
    app.post('/login/nexus', passport.authenticate('login-nexus', {
        failureFlash: 'Invalid username or password.',
        successFlash: 'Accepted.'
    }), function(req, res) {
        res.send(req.user);
    });
    app.post('/login/eclass', passport.authenticate('login-eclass', {
        failureFlash: 'Invalid username or password.',
        successFlash: 'Accepted.'
    }), function(req, res) {
        res.send(req.user);
    });
    app.post('/login/venus', passport.authenticate('login-venus', {
        failureFlash: 'Invalid username or password.',
        successFlash: 'Accepted.'
    }), function(req, res) {
        res.send(req.user);
    });
    // Signup route (only one).
    app.post('/signup', passport.authenticate('signup', {
        failureFlash: 'Username is in use.',
        successFlash: 'Accepted.'
    }), function(req, res) {
        // first add
        res.send(req.user);
    });
    app.post('/logout', function(req, res) {
        req.logOut();
        res.send(200);
    });

    // Link/Unlink service.
    app.post('/link/eclass', passport.authenticate('link-eclass', {
        failureFlash: 'Username is in use.',
        successFlash: 'Accepted.'
    }), function(req, res) {

    });
    // app.post('/link/mail');
    // app.post('/link/venus');
    // app.post('/unlink/eclass');
    // app.post('/unlink/mail');
    // app.post('/unlink/venus');

    // Everything else is handled by angularJS router.
    app.get('*', function(req, res) {
        res.sendFile('./public/index.html');
    });
};
