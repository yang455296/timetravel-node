const jwt = require('jsonwebtoken');

const myToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWQiOjEzLCJlbWFpbGwiOiJlZWVAZ21haWwuY29tIiwiaWF0IjoxNjY5MTkyMzAwfQ.7vbkEyhffVvKB-6UbnvwnAVKPt-VC0Wrb53SkyNAo9I';


const payload = jwt.verify(myToken, 'lasdkf39485349hflskdfsdklfsk');

console.log(payload);