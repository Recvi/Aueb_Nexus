 var bcrypt = require('bcrypt-nodejs');

 module.exports = function() {
     return {
         id: '',
         firstName: '',
         lastName: ''
         created: '',
         lastLogin: '',
         nexus: {
             username: '',
             password: ''
         },
         eclass: {
             username: '',
             password: ''
         },
         venus: {
             username: '',
             password: ''
         },
         // generating a hash
         generateHash: function(password) {
             bcrypt.genSalt(8, function(err, salt) {
                 bcrypt.hash(password, salt, function(err, hash) {
                     return hash;
                 });
             });
         },
         // checking if password is valid
         validPassword: function(password1, password2) {
             bcrypt.compare(password1, password2, function(err, res) {
                 return res;
             });
         }
     };
 }
