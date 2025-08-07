global.__basePath = process.cwd() + '/';
const app = require(__basePath + 'app/app.js');
// const port = process.env.NODE_PORT;
const port = 61000;
const IPADDR = '192.168.150.2';

const http = require('http');
const https = require('https');
const fs = require('fs');

/**
 * @description Listen Server at configured port
 * @event App Listener
 */
// app.listen(port, function () {
//     console.log(`Listening port ${port}`);
// });

var options = {
    // key: fs.readFileSync('./kwinn.key'),
    // cert: fs.readFileSync('./kwinn.crt'),
    // ca: fs.readFileSync('./ca-bundle.crt'),
    // requestCert: false,
    // rejectUnauthorized: false
};

http.createServer(options, app).listen(port,IPADDR, function () {
    console.log(`Listening ${IPADDR} port ${port}`);
});
