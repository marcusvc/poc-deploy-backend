const express = require('express');
const app = express();
const port = 3000;
const PromiseFtp = require('promise-ftp');
const readline = require('readline');
const fs = require('fs');

var ftp = new PromiseFtp();
ftp.connect({host: "test.rebex.net", user: "demo", password: "password"})
    .then(function (serverMessage) {
        console.log("Server message: " + serverMessage);
        return ftp.get('readme.txt');
    })
    .then(function (stream) {
        return new Promise(function (resolve, reject) {
            stream.once('close', resolve);
            stream.once('error', reject);
            //stream.pipe(fs.createWriteStream('readme.local-copy.txt'));
            var rl = readline.createInterface({
                input: stream
            });
            rl.on('line', function(line) {
                console.log(line);
            });
        });
    })
    .then(function () {
        return ftp.end();
    })
    .catch(function(err) {
        console.log("something went wrong: " + err);
        //res.status(500).send('SERVER ERROR');
    });

app.get('/deploy', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));