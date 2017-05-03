let path = require('path');
let winston = require('winston');
let colors = require('colors');
colors.enabled = true;
let nconf = require('nconf');
nconf.argv()
    .env()
    .file({file:'config.json'});
const WEB = nconf.get('WEB');
const PORT = nconf.get('PORT');
const IP = nconf.get('IP');

winston.info(`WEB is ${WEB}`.green);

//load main modules
let express = require('express');
let fs = require('fs');

//load express middleware modules
let logger = require('morgan');
let compression = require('compression');
let favicon = require('serve-favicon');
let bodyParser = require('body-parser');
let rest = require('./studentsRESTmongo');
// let rest = require('./studentsRESTmysql');

winston.info('Loading Server...'.green);

//create express app
let app = express();

//insert middleware
app.use(logger('dev'));
app.use(compression());
app.use(favicon(WEB + '/img/favicon.png'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(rest);

//traditional webserver stuff for serving static files
app.use(express.static(WEB));

//start server
let server = app.listen(PORT, IP);

//shutdown handling
function gracefullShutdown() {
    winston.info('\nStarting Shutdown'.red);
    server.close(function() {
        winston.info('\nShutdown Complete'.green);
    });
}

process.on('SIGTERM', gracefullShutdown); //kill (terminate)

process.on('SIGINT', gracefullShutdown); //Ctrl+C (interrupt)

//SIGKILL (kill -9) can't be caught by any process, including node
//SIGSTP/SIGCONT (stop/continue) can't be caught by node

winston.info(`Listening on port ${PORT}`.cyan);

//server running check... better go catch it. ha.
winston.info("server running...\n".green);