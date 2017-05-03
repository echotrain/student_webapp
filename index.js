//NODE.js script
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

winston.info('Loading Server...'.green);

//create express app
let app = express();

//insert middleware
app.use(logger('dev'));
app.use(compression());
app.use(favicon(WEB + '/img/favicon.png'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//file list data
winston.info("Checking File System\n".green);
let fileList = fs.readdirSync(__dirname + '/students').map(fileName => fileName.replace('.json', ''));


//id creation
const ID_SIZE = 4;

function idFiller(number, spaces) {
    let id = `${number}`;
    while (id.length < spaces) {
        id = '0' + id;
    }
    return id;
}

function* generateID() {
    let startID = Math.max.apply(null, fileList.map(fileName => parseInt(fileName)));
    startID++;
    while (true) {
        let newID = idFiller(startID++, ID_SIZE);
        fileList.push(newID);
        yield newID;
    }
}
let getID = generateID();


//REST end points
//CREATE
app.post('/api/v1/students', function(req, res) {
    let data = JSON.stringify(req.body, null, '\t');
    let id = getID.next().value;
    
    fs.writeFile(`${__dirname}/students/${id}.json`, data, 'utf8', function(err) {
        if (err) throw err;
        
        res.status(201).json(id);
    });
});

//READ
app.get('/api/v1/students/:id.json', function(req, res) {
    let id = req.params.id;
    fs.readFile(`${__dirname}/students/${id}.json`, 'utf8', function(err, data) {
        if (err) throw err; //TODO handle 404
        
        res.status(200).json(JSON.parse(data));
    });
});

//UPDATE
app.put('/api/v1/students/:id.json', function(req, res) {
    let id = req.params.id;
    let data = JSON.stringify(req.body, null, '\t');
    fs.writeFile(`${__dirname}/students/${id}.json`, data, 'utf8', function(err) {
        if (err) throw err;
        
        res.sendStatus(204);
    });
});

//DELETE
app.delete('/api/v1/students/:id.json', function(req, res) {
    let id = req.params.id;
    let idIndex = fileList.indexOf(id);
    
    if (idIndex === -1) {
        res.status(404).sendFile(`${WEB}/404.html`, {'root': __dirname});
    }
    else {
        fileList.splice(idIndex, 1);
        fs.unlink(`${__dirname}/students/${id}.json`);
        res.sendStatus(204);
    }
});

//LIST
app.get('/api/v1/students.json', function(req, res) {
    fs.readdir(`${__dirname}/students`, function(err, files) {
        if (err) throw err;
        let list = files.map(fileName => fileName.replace('.json', ''));
        res.status(200).json(list);
    });
});


//traditional webserver stuff for serving static files
app.use(express.static(WEB));

app.get('img/images.json', function(req, res) { //get student images
    res.status(200).sendFile(`${WEB}/img/images.json`, {'root': __dirname});
});

app.get('*', function(req, res) {
    res.status(404).sendFile(`${WEB}/404.html`, {'root': __dirname});
});


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