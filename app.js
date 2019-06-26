const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const app = express();
const PromiseFtp = require('promise-ftp');
const fs = require('fs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const winston = require('winston');
const logConfiguration = require('./config/config-log')(module);
Distribuicao = require('./models/distribuicao-model');
routes = require('./routes/distribuicao-routes');
const distribuicaoCtrl = require('./controllers/distribuicao-controller');

const logger = winston.createLogger(logConfiguration);
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI || 'mongodb://localhost/dbdistribuicao';
mongoose.Promise = global.Promise;
mongoose.connect(uri, {useNewUrlParser: true}, function(err){
    if (err) {
        logger.info('Unable to connect to the mongoDB server. %s', err);
    } else {
        logger.info('Connection established to %s', uri);
    }
});

var ftp = new PromiseFtp();
//ftp.connect({host: "localhost", user: "marcus", password: "lyjum7"})
ftp.connect({host: "10.3.9.1", user: "dg07876", password: "rostso01"})
    .then(function (serverMessage) {
        logger.info('Server message: %s', serverMessage);
        return ftp.ascii();
    })
    .then(function () {
        logger.info('Alterado para ASCII');
        return ftp.cdup();
    })
    .then(function () {
        logger.info('Subiu o nível do diretório atual');
        return ftp.pwd();
    })
    .then(function (pwdResult) {
          logger.info('Diretório atual: %s', pwdResult);
          return ftp.get('S1110.DG07876.TESTE044');
          //return ftp.get('/srv/ftp/readme.local-copy.txt');
    })
    .then(function (getResultStream) {
        return new Promise(function (resolve, reject) {
            getResultStream.once('close', resolve);
            getResultStream.once('error', reject);
            //stream.pipe(fs.createWriteStream('readme.local-copy.txt'));
            distribuicaoCtrl.parseDistribuicao(getResultStream);
        });
    })
    .then(function () {
        return ftp.end();
    })
    .catch(function(err) {
        logger.error('Something went wrong: %s', err);
    });
    
app.set('view engine', 'ejs');
app.use(compression());  //Compress all routes based on request header supported compression
app.use(helmet());  //Protects against well known vulnerabilities
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

routes(app);

app.listen(port, () => logger.info('Example app listening on port %d!', port));