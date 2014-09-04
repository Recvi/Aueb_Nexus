  var request = require('request'),
      cheerio = require('cheerio'),
      request = require('request');


  var url = 'http://eclass.aueb.gr/';

  process.on('message', function(
      if) {
      user(user.eclass.username == "") process.send(false);
      request.post(url, {
              form: {
                  uname: user.eclass.username,
                  submit: 'Είσοδος',
                  pass: user.eclass.password
              }
          },
          function(error, request, html) {
              if (!error) {
                  var $ = cheerio.load(html);


              }
          });
      process.send(user);
  });
