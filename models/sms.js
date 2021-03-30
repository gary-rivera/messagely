var accountSid = 'AC03383febee37523a8510e8c67f6e5be0'; // Your Account SID from www.twilio.com/console
var authToken = '5ed70264320f8914abedd9f9dd87b1aa';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);


module.exports = client;