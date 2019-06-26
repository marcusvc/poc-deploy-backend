'use strict';

const mongoose = require('mongoose');
const readline = require('readline');
const winston = require('winston');
const logConfiguration = require('../config/config-log')(module);

const logger = winston.createLogger(logConfiguration);

Distribuicao = mongoose.model('Distribuicao');
const lpad = 2;
const lpadLogon = 12;
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

exports.parseDistribuicao = function (stream) {
   var rl = readline.createInterface({
      input: stream
   });
   var readNext;
   var logon;
   rl.on('line', function (line) {
      if (readNext && (line.includes('*****') || line.includes('Number of'))) {
         readNext = false;
      } else if (readNext) {
         //var distribuicao = parseLineIntoDistribuicao(line, logon);
         //save(distribuicao);
      } else if (!readNext && line.includes('--------')) {
         readNext = true;
      } else if (!readNext && line.includes('NEXT LOGON')) {
         logon = obterLogon(line);
      }
   }).on('close', function () {
      logger.info('Stream closed...');
      // FIXME: Não esquecer de comentar a linha abaixo 
      //deleteAll();
   });
}

function parseLineIntoDistribuicao(line, logon) {
   var registro = {};
   registro.logon = logon;
   registro.nome = line.slice(lpad, lpad + nameLength).trim();
   registro.tipo = line.slice(lpad + nameLength, lpad + nameLength + typeLength).trim();
   registro.sc = line.slice(lpad + nameLength + typeLength, lpad + nameLength + typeLength + scLength).trim();
   registro.sm = line.slice(lpad + nameLength + typeLength + scLength, lpad + nameLength + typeLength + scLength + smLength).trim();
   registro.version = line.slice(lpad + nameLength + typeLength + scLength + smLength, lpad + nameLength + typeLength + scLength + smLength + versionLength).trim();
   registro.user = line.slice(lpad + nameLength + typeLength + scLength + smLength + versionLength, lpad + nameLength + typeLength + scLength + smLength + versionLength + userLength).trim();
   registro.data = line.slice(lpad + nameLength + typeLength + scLength + smLength + versionLength + userLength, lpad + nameLength + typeLength + scLength + smLength + versionLength + userLength + dateLength).trim();
   registro.hora = line.slice(lpad + nameLength + typeLength + scLength + smLength + versionLength + userLength + dateLength, lpad + nameLength + typeLength + scLength + smLength + versionLength + userLength + dateLength + timeLength).trim();
   registro.codePage = line.slice(lpad + nameLength + typeLength + scLength + smLength + versionLength + userLength + dateLength + timeLength, lpad + nameLength + typeLength + scLength + smLength + versionLength + userLength + dateLength + timeLength + codePageLength).trim();
   return registro;
}

function obterLogon(line) {
   return line.slice(lpadLogon).trim();
}

function save(distribuicao) {
   var new_distribuicao = new Distribuicao(distribuicao);
   new_distribuicao.save(function (err, saved) {
      if (err) {
         logger.error(err.errmsg);
      } else {
         logger.info(saved);
         logger.info('Distribuição salva com sucesso\n');
      }
   });
}

function deleteAll() {
   Distribuicao.deleteMany({}, function (err, msg) {
      if (err) {
         logger.error(err);
      } else {
         logger.info('Coleção deletada com sucesso');
      }
   });
}

// Router functions
exports.hello = function (req, res) {
   Distribuicao.find({}, function (err, msg) {
      if (err) {
         res.send(err);
      } else {
         res.send('Hello world!');
      }
   });
};
exports.list_all_distribuicao = function (req, res) {
   Distribuicao.find({}, function (err, msg) {
      if (err) {
         res.send(err);
      } else {
         res.render('data', {dados: msg});
      }
   });
};

exports.create_a_distribuicao = function (req, res) {
   var new_distribuicao = new Distribuicao(req.body);
   new_distribuicao.save(function (err, msg) {
      if (err) {
         logger.error('Input:');
         logger.error(req);
         logger.error('Erro:');
         logger.error(err);
         res.send(err);
      } else {
         res.json(msg);
      }
   });
};

exports.read_a_distribuicao = function (req, res) {
   Distribuicao.findById(req.params.msgId, function (err, msg) {
      if (err) {
         res.send(err);
      } else {
         res.json(msg);
      }
   });
};

exports.update_a_distribuicao = function (req, res) {
   Distribuicao.findOneAndUpdate({ _id: req.params.msgId }, req.body, { new: true }, function (err, msg) {
      if (err) {
         res.send(err);
      } else {
         res.json(msg);
      }
   });
};

exports.delete_a_distribuicao = function (req, res) {
   Distribuicao.deleteOne({
      _id: req.params.msgId
   }, function (err, msg) {
      if (err) {
         res.send(err);
      } else {
         res.json({ message: 'Distribuicao deletada com sucesso' });
      }
   });
};