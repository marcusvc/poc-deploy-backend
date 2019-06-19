'use strict';

const mongoose = require('mongoose');
Distribuicao = mongoose.model('Distribuicao');

exports.list_all_distribuicao = function(req, res) {
    Distribuicao.find({}, function(err, msg) {
      if (err) {
         res.send(err);
      }
      res.json(msg);
   });
};

exports.create_a_distribuicao = function(req, res) {
   var new_distribuicao = new Distribuicao(req.body);
   new_distribuicao.save(function(err, msg) {
   if (err) {
      res.send(err);
   }
   res.json(msg);
   });
};

exports.read_a_distribuicao = function(req, res) {
    Distribuicao.findById(req.params.msgId, function(err, msg) {
   if (err) {
      res.send(err);
   }
   res.json(msg);
   });
};

exports.update_a_distribuicao = function(req, res) {
    Distribuicao.findOneAndUpdate({_id: req.params.msgId}, req.body, {new: true}, function(err, msg) {
   if (err) {
      res.send(err);
   }
   res.json(msg);
   });
};

exports.delete_a_distribuicao = function(req, res) {
    Distribuicao.deleteOne({
      _id: req.params.msgId
   }, function(err, msg) {
   if (err) {
      res.send(err);
   }
   res.json({ message: 'Distribuicao deletada com sucesso' });
   });
};