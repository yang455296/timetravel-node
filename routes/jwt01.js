const jwt = require('jsonwebtoken');

const str = jwt.sign({
    sid: 13,
    emaill: 'eee@gmail.com'
}, 'lasdkf39485349hflskdfsdklfsk');

console.log(str)