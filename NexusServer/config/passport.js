var LocalStrategy = require('passport-local').Strategy;
var User = require('./app/models/user.js');

module.exports = function(passport, db_connection) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session


    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        db_connection.connect();
        var user = User();
        user.id = id;
        db_connection.query('SELECT n.firstName, n.lastName, n.created, n.last_login, c.login, c.password  FROM `AuebNexusAccounts` AS n INNER JOIN `Credentials` AS c ON n.credID = c.credID WHERE n.userID = ' + id + ';',
            function(err, rows, fields) {
                if (err) return done(err);
                user.firstName = rows[0].firstName;
                user.lastName = rows[0].lastName;
                user.created = rows[0].created;
                user.lastLogin = rows[0].last_login;
                user.nexus.username = rows[0].login;
                user.nexus.password = rows[0].password;
            });
        db_connection.query('SELECT c.login, c.password FROM `EclassAccounts` AS e INNER JOIN `Credentials` AS c ON e.credID = c.credID WHERE e.userID = ' + id + ';',
            function(err, rows, fields) {
                if (err) return done(err);
                if (rows.length == 1) {
                    user.eclass.username = rows[0].login;
                    user.eclass.password = rows[0].password;
                }
            });
        db_connection.query('SELECT c.login, c.password FROM `VenusAccounts` AS v INNER JOIN `Credentials` AS c ON v.credID = c.credID WHERE v.userID = ' + id = ';',
            function(err, rows, fields) {
                if (err) return done(err);
                if (rows.length == 1) {
                    user.venus.username = rows[0].login;
                    user.venus.password = rows[0].password;
                    return done(null, user);
                }
            });
        db_connection.end();

    });

    // =========================================================================
    // LOGIN ===================================================================
    // =========================================================================
    // Strategy used for login with Nexus Account.
    passport.use('login-nexus', new LocalStrategy(
        function(username, password, done) {
            // asynchronous
            process.nextTick(function() {
                db_connection.connect();
                var user = User();

                // Check if the user can be authenticated
                db_connection.query('SELECT n.userID, n.firstName, n.lastName, n.created, n.last_login, c.login, c.password FROM` AuebNexusAccounts` AS n INNER JOIN` Credentials` AS c ON n.credID = c.credID WHERE c.login = ' + username + ' AND c.password = ' + password + ';',
                    function(err, rows, fields) {
                        if (err) return done(err);
                        if (rows.length == 1) {
                            user.id = rows[0].userID;
                            user.firstName = rows[0].firstName;
                            user.lastName = rows[0].lastName;
                            user.created = rows[0].created;
                            user.lastLogin = rows[0].last_login;
                            user.nexus.username = rows[0].login;
                            user.nexus.password = rows[0].password;
                        } else { // case: incorrect password/username.
                            return done(null, false);
                        }
                    });
                // Gather other credentials, if any.
                db_connection.query('SELECT c.login, c.password FROM `EclassAccounts` AS e INNER JOIN `Credentials` AS c ON e.credID = c.credID WHERE e.userID = ' + user.id + ';',
                    function(err, rows, fields) {
                        if (err) return done(err);
                        if (rows.length == 1) {
                            user.eclass.username = rows[0].login;
                            user.eclass.password = rows[0].password;
                        }

                    });
                db_connection.query('SELECT c.login, c.password FROM `VenusAccounts` AS v INNER JOIN `Credentials` AS c ON v.credID = c.credID WHERE v.userID = ' + user.id + ';',
                    function(err, rows, fields) {
                        if (err) return done(err);
                        if (rows.length == 1) {
                            user.eclass.username = rows[0].login;
                            user.eclass.password = rows[0].password;
                        }
                        return done(null, user);
                    });
                db_connection.end();
            });
        }));
    // Strategy used for login with Nexus Account.
    passport.use('login-eclass', new LocalStrategy(
        function(username, password, done) {
            // asynchronous
            process.nextTick(function() {
                db_connection.connect();
                var user = User();

                // Check if the user can be authenticated
                db_connection.query('SELECT e.userID, c.login, c.password FROM `EclassAccounts` AS e INNER JOIN `Credentials` AS c ON e.credID = c.credID WHERE c.login = ' + username + ' AND c.password = ' + password + ';',
                    function(err, rows, fields) {
                        if (err) return done(err);
                        if (rows.length == 1) {
                            user.id = rows[0].userID;
                            user.eclass.username = rows[0].login;
                            user.eclass.password = rows[0].password;
                        } else {
                            done(null, false);
                        }
                    });
                // Gather basic information and other credentials, if any.
                db_connection.query('SELECT n.userID, n.firstName, n.lastName, n.created, n.last_login, c.login, c.password  FROM `AuebNexusAccounts` AS n INNER JOIN `Credentials` AS c ON n.credID = c.credID WHERE n.userID = ' + user.id + ';',
                    function(err, rows, fields) {
                        if (err) return done(err);
                        if (rows.length == 1) {
                            user.id = rows[0].userID;
                            user.firstName = rows[0].firstName;
                            user.lastName = rows[0].lastName;
                            user.created = rows[0].created;
                            user.lastLogin = rows[0].last_login;
                            user.nexus.username = rows[0].login;
                            user.nexus.password = rows[0].password;
                        }

                    });
                db_connection.query('SELECT c.login, c.password FROM `VenusAccounts` AS v INNER JOIN `Credentials` AS c ON v.credID = c.credID WHERE v.userID = ' + user.id + ';',
                    function(err, rows, fields) {
                        if (err) return done(err);
                        if (rows.length == 1) {
                            user.eclass.username = rows[0].login;
                            user.eclass.password = rows[0].password;
                        }
                        return done(null, user);
                    });
                db_connection.end();
            });
        }));
    // Strategy used for login with Venus Account.
    passport.use('login-venus', new LocalStrategy(
        function(username, password, done) {
            // asynchronous
            process.nextTick(function() {
                db_connection.connect();
                var user = User();

                // Check if the user can be authenticated
                db_connection.query('SELECT e.userID, c.login, c.password FROM `VenusAccounts` AS v INNER JOIN `Credentials` AS c ON v.credID = c.credID WHERE c.login = ' + username + ' AND c.password = ' + password + ';',
                    function(err, rows, fields) {
                        if (err) return done(err);
                        if (rows.length == 1) {
                            user.id = rows[0].userID;
                            user.eclass.username = rows[0].login;
                            user.eclass.password = rows[0].password;
                        } else {
                            done(null, false);
                        }
                    });
                // Gather basic information and other credentials, if any.
                db_connection.query('SELECT n.userID, n.firstName, n.lastName, n.created, n.last_login, c.login, c.password  FROM `AuebNexusAccounts` AS n INNER JOIN `Credentials` AS c ON n.credID = c.credID WHERE n.userID = ' + user.id + ';',
                    function(err, rows, fields) {
                        if (err) return done(err);
                        if (rows.length == 1) {
                            user.id = rows[0].userID;
                            user.firstName = rows[0].firstName;
                            user.lastName = rows[0].lastName;
                            user.created = rows[0].created;
                            user.lastLogin = rows[0].last_login;
                            user.nexus.username = rows[0].login;
                            user.nexus.password = rows[0].password;
                        }

                    });
                db_connection.query('SELECT c.login, c.password FROM `EclassAccounts` AS e INNER JOIN `Credentials` AS c ON e.credID = c.credID WHERE e.userID = ' + user.id + ';',
                    function(err, rows, fields) {
                        if (err) return done(err);
                        if (rows.length == 1) {
                            user.eclass.username = rows[0].login;
                            user.eclass.password = rows[0].password;
                        }
                        return done(null, user);
                    });
                db_connection.end();
            });
        }));
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy(
        function(username, password, done) {
            // asynchronous
            process.nextTick(function() {
                db_connection.connect();

                // Whether we're signing up or connecting an account, we'll need
                // to know if the username is in use.
                db_connection.query('SELECT login FROM `Credentials` WHERE login = ' + username + ';',
                    function(err, rows, fields) {
                        if (err) return done(err);
                        if (rows.length == 1) return done(null, false);
                    });

                // create the user
                var newUser = User();
                newUser.nexus.username = username;
                newUser.nexus.password = newUser.generateHash(password);

                db_connection.query('INSERT INTO `Credentials` (`login`, `password`)
    VALUES (' + newUser.nexus.username + ', ' + newUser.nexus.password + ');',
                    function(err, rows, fields) {
                        if (err) return done(err);
                    });
                var credId;
                db_connection.query('SELECT credID FROM `Credentials` WHERE login = ' + newUser.nexus.username + ';',
                    function(err, rows, fields) {
                        if (err) return done(err);
                        credId = rows[0].credID;
                    });
                db_connection.query('INSERT INTO `AuebNexusAccounts`(`credID`) VALUES(' + credId + ');',
                    function(err, rows, fields) {
                        if (err) return done(err);
                        return done(null, newUser);
                    });

                db_connection.end();
            });
        }));

    passport.use('link-eclass', new LocalStrategy({
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not
        },
        function(req, username, password, done) {
            // asynchronous
            process.nextTick(function() {
                db_connection.connect();
                // Whether we're signing up or connecting an account, we'll need
                // to know if the username is in use.
                db_connection.query('SELECT login FROM `Credentials` WHERE login = ' + username + ';',
                    function(err, rows, fields) {
                        if (err) return done(err);
                        if (rows.length == 1) return done(null, false);
                    });

                if (req.user) {
                    var user = req.user;
                    user.eclass.username = username;
                    user.eclass.password = user.generateHash(password);

                    db_connection.query('INSERT INTO `Credentials` (`login`, `password`)
    VALUES (' + user.eclass.username + ', ' + user.eclass.password + ');',
                        function(err, rows, fields) {
                            if (err) return done(err);
                        });
                    var credId;
                    db_connection.query('SELECT credID FROM `Credentials` WHERE login = ' + newUser.nexus.username + ';',
                        function(err, rows, fields) {
                            if (err) return done(err);
                            credId = rows[0].credID;
                        });
                    db_connection.query('INSERT INTO `EclassAccounts`(`credID`, `userID`) VALUES(' + credId + ', ' + user.id + ');',
                        function(err, rows, fields) {
                            if (err) return done(err);
                            return done(null, user);
                        });
                } else return done(null, false);
                db_connection.end();
            });
        }));
};
