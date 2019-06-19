'use strict';

const readline = require('readline');
const controller = require('./distribuicao-controller');
const lpad = 2;
const nameLength = 10;
const typeLength = 13;
const scLength = 5;
const smLength = 4;
const versionLength = 9;
const userLength = 10;
const dateLength = 12;
const timeLength = 9;
const codePageLength = 33;
const archLength = 5;
const nocLength = 7;

exports.parseDistribuicao = function(stream) {
    var rl = readline.createInterface({
        input: stream
    });
    var readNext;
    rl.on('line', function(line) {
        if (readNext && (line.includes('*****') || line.includes('Number of'))) {
            readNext = false;
        } else if (readNext) {
            var registro = splitLine(line);
            console.log(registro);
        } else if (!readNext && line.includes('--------')) {
            readNext = true;
        }
    });
}

function splitLine(line) {
    var registro = {};
    registro.nome = line.slice(lpad, lpad+nameLength).trim();
    registro.tipo = line.slice(lpad+nameLength, lpad+nameLength+typeLength).trim();
    registro.sc = line.slice(lpad+nameLength+typeLength, lpad+nameLength+typeLength+scLength).trim();
    registro.sm = line.slice(lpad+nameLength+typeLength+scLength, lpad+nameLength+typeLength+scLength+smLength).trim();
    registro.version = line.slice(lpad+nameLength+typeLength+scLength+smLength, lpad+nameLength+typeLength+scLength+smLength+versionLength).trim();
    registro.user = line.slice(lpad+nameLength+typeLength+scLength+smLength+versionLength, lpad+nameLength+typeLength+scLength+smLength+versionLength+userLength).trim();
    registro.data = line.slice(lpad+nameLength+typeLength+scLength+smLength+versionLength+userLength, lpad+nameLength+typeLength+scLength+smLength+versionLength+userLength+dateLength).trim();
    registro.hora = line.slice(lpad+nameLength+typeLength+scLength+smLength+versionLength+userLength+dateLength, lpad+nameLength+typeLength+scLength+smLength+versionLength+userLength+dateLength+timeLength).trim();
    registro.codePage = line.slice(lpad+nameLength+typeLength+scLength+smLength+versionLength+userLength+dateLength+timeLength, lpad+nameLength+typeLength+scLength+smLength+versionLength+userLength+dateLength+timeLength+codePageLength).trim();
    return registro;
}