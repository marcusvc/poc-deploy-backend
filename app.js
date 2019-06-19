const express = require('express');
const app = express();
const PromiseFtp = require('promise-ftp');
const fs = require('fs');
const mongoose = require('mongoose');
Distribuicao = require('./models/distribuicao-model');
const bodyParser = require('body-parser');
routes = require('./routes/distribuicao-routes');
const distribuicaoParser = require('./controllers/distribuicao-parser');

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
ftp.connect({host: "10.3.9.1", user: "dg07876", password: "rostso01"})
    .then(function (serverMessage) {
        console.log('Server message: '+serverMessage);
        return ftp.ascii();
    })
    .then(function () {
        console.log('Alterado para ASCII');
        return ftp.cdup();
    })
    .then(function (cdup) {
        console.log('Subiu o nível do diretório atual');
        return ftp.pwd();
    })
    .then(function (pwd) {
          console.log('Diretório atual: ' + pwd);
          return ftp.get('S1110.DG07876.TESTE04');
    })
    .then(function (stream) {
        return new Promise(function (resolve, reject) {
            stream.once('close', resolve);
            stream.once('error', reject);
            stream.pipe(fs.createWriteStream('readme.local-copy.txt'));
            distribuicaoParser.parseDistribuicao(stream);
        });
    })
    .then(function () {
        return ftp.end();
    })
    .catch(function(err) {
        console.log("something went wrong: " + err);
    });

app.get('/deploy', (req, res) => {
    res.send('Hello World!');
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
routes(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));