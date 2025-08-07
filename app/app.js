const cors       = require('cors');
const helmet     = require('helmet');
const express    = require('express');
const app        = express();
const exception  = require('../app/util/exception');
const {dbConnection} = require('../app/util/mongo');
const path = require('path');

const cron = require('cron');
const axios = require('axios');
// load env variables
require('dotenv').config();
app.use('/app/public',express.static('app/public'));
const frontendBuildPath = path.join(__dirname, '../front-end/build');
app.use(express.static(frontendBuildPath));
app.use('/assets',express.static('app/public'));

// connect to mongo
dbConnection();

/*
 * @description Middlewares for parsing body
 */
app.use(cors({
    origin  : '*',
    headers : process.env.CORS_HEADERS.split(",") || '*',
    methods : ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'],
    allowedHeaders: ['Content-Type', 'key', 'authToken']
}));


app.use(helmet());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

const cronJob = require('./module/controller/cron_jobs/rechargeData');

app.get('/test-connection', async (req, res) => {
    const result = await cronJob.syncAllPlans();
    // res.send(JSON.stringify(result));
    res.send(`<h1>Welcome to K-Winn </h1>`);
});

const job1 = new cron.CronJob('0 1 * * *', async () => {
    try {
        console.log('Cron Start');
        await cronJob.getCountries();
        await cronJob.syncAllOperators();
        await cronJob.syncAllPlans();
        console.log('Cron End');
        return true;
    } catch (error) {
        console.log('[error]', error);
    }
});
job1.start();

// const job1 = new cron.CronJob('*/2 * * * *', async () => {
//     console.log('5 minutes interval job triggered');
//     try {
//         // Example of calling a function or hitting a URL
//         const response = await axios.get('https://k-winn.com/inactive-past-winner');
//         console.log('Cron job triggered successfully:', response.data);
//     } catch (error) {
//         console.error('Error during 5-minute cron job:', error);
//     }
// });
// job1.start();
app.use(function (req, res, next) {

    let default_src = "default-src https://cdnjs.cloudflare.com/ 'self' 'unsafe-eval';";
    let font_src    = "font-src 'self' https://fonts.gstatic.com/ ;";
    let img_src     = "img-src 'self' https://crm.k-winn.com/ blob: data: ;";
    let script_src  = "script-src 'self' https://cdnjs.cloudflare.com/ https://code.jquery.com/ https://cdn.jsdelivr.net/ 'unsafe-eval';";
    let style_src   = "style-src 'self' https://fonts.googleapis.com/ 'unsafe-inline';";
    let frame_src   = "frame-src 'self';";
    let connect_src = "connect-src 'self' https://crm.k-winn.com/ https://al.k-winn.com/ ;";
    let script_src_elem = "script-src-elem 'self' https://cdn.jsdelivr.net/ https://code.jquery.com/ 'unsafe-inline' 'unsafe-eval';";

    res.setHeader(
        'Content-Security-Policy', 
        `${default_src} ${font_src} ${img_src} ${script_src} ${style_src} ${frame_src} ${connect_src} ${script_src_elem}`
    );

    next();
});
//////////////////////////////////
/*
 * Injecting all dependencies Modules + common libs
 */
require('../app/config/dependency')(app);

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "front-end/build/index.html"));
});

/*
 * @description Catch 404 error if no route found
 */
app.use(exception.unknownRouteHandler);

/*
 * @description Error handler
 */
app.use(exception.errorHandler);

module.exports = app;
