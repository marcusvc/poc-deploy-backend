const express = require('express');
const app = express();
const PromiseFtp = require('promise-ftp');
const fs = require('fs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
Distribuicao = require('./models/distribuicao-model');
routes = require('./routes/distribuicao-routes');
const distribuicaoCtrl = require('./controllers/distribuicao-controller');

const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI || 'mongodb://localhost/distribuicao';
mongoose.Promise = global.Promise;
mongoose.connect(uri, {useNewUrlParser: true}, function(err){
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        console.log('Connection established to %s', uri);
    }
});

var ftp = new PromiseFtp();
//ftp.connect({host: "localhost", user: "marcus", password: "lyjum7"})
ftp.connect({host: "10.3.9.1", user: "dg07876", password: "rostso01"})
    .then(function (serverMessage) {
        console.log('Server message: '+serverMessage);
        return ftp.ascii();
    })
    .then(function () {
        console.log('Alterado para ASCII');
        return ftp.cdup();
    })
    .then(function () {
        console.log('Subiu o nível do diretório atual');
        return ftp.pwd();
    })
    .then(function (pwdResult) {
          console.log('Diretório atual: ' + pwdResult);
          return ftp.get('S1110.DG07876.TESTE04');
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
        console.log("something went wrong: " + err);
    });
    
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

routes(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));