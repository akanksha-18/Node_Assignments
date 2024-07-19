// generate_secret.js
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
console.log('Here is your generated secret:');
console.log(secret);
console.log('Add this to your .env file as SESSION_SECRET=<generated_secret>');