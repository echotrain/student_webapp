//NODE.js script
console.log('Loading Server');
const WEB = __dirname.replace('server','web');
const SERV = __dirname + '/server';
console.log(`WEB is ${WEB}`);

//load main modules
var express = require('express');
var fs = require('fs');

//load express middleware modules
var logger = require('morgan');
var compression = require('compression');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');


//create express app
var app = express();

//insert middleware
app.use(logger('dev'));
app.use(compression());
app.use(favicon(WEB + '/img/favicon.png'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//file list data
console.log("Checking File System");
var fileList = fs.readdirSync(__dirname + '/students').map(fileName => fileName.replace('.json', ''));


//id creation
const ID_SIZE = 4;

function idFiller(number, spaces) {
    var id = `${number}`;
    while (id.length < spaces) {
        id = '0' + id;
    }
    return id;
}

function* generateID() {
    var startID = Math.max.apply(null, fileList.map(fileName => parseInt(fileName)));
    startID++;
    while (true) {
        var newID = idFiller(startID++, ID_SIZE);
        fileList.push(newID);
        yield newID;
    }
}
var getID = generateID();


//REST end points
//CREATE
app.post('/api/v1/students', function(req, res) {
    var data = JSON.stringify(req.body, null, '\t');
    var id = getID.next().value;
    
    fs.writeFile(`${__dirname}/students/${id}.json`, data, 'utf8', function(err) {
        if (err) throw err;
        
        res.status(201).json(id);
    });
});

//READ
app.get('/api/v1/students/:id.json', function(req, res) {
    var id = req.params.id;
    fs.readFile(`${__dirname}/students/${id}.json`, 'utf8', function(err, data) {
        if (err) throw err; //TODO handle 404
        
        res.status(200).json(JSON.parse(data));
    });
});

//UPDATE
app.put('/api/v1/students/:id.json', function(req, res) {
    var id = req.params.id;
    var data = JSON.stringify(req.body, null, '\t');
    fs.writeFile(`${__dirname}/students/${id}.json`, data, 'utf8', function(err) {
        if (err) throw err;
        
        res.sendStatus(204);
    });
});

//DELETE
app.delete('/api/v1/students/:id.json', function(req, res) {
    var id = req.params.id;
    var idIndex = fileList.indexOf(id);
    
    if (idIndex === -1) {
        res.status(404).sendFile(WEB + '/404.html');
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
        var list = files.map(fileName => fileName.replace('.json', ''));
        res.status(200).json(list);
    });
});


//traditional webserver stuff for serving static files
app.use(express.static(WEB));

app.get('img/images.json', function(req, res) { //get student images
    res.status(200).sendFile(`${WEB}/img/images.json`);
});

app.get('*', function(req, res) {
    res.status(404).sendFile(WEB + '/404.html');
});


//start server
var server = app.listen(process.env.PORT, process.env.IP);

//shutdown handling
function gracefullShutdown() {
    console.log('\nStarting Shutdown');
    server.close(function() {
        console.log('\nShutdown Complete');
    });
}

process.on('SIGTERM', gracefullShutdown); //kill (treminate)

process.on('SIGINT', gracefullShutdown); //Ctrl+C (interrupt)

//SIGKILL (kill -9) can't be caught by any process, including node
//SIGSTP/SIGCONT (stop/continue) can't be caught by node

// console.log(`Listening on port ${port}`); //TODO define the port

//server running check... better go catch it. ha.
console.log("server running");