'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var distribuicaoSchema = new Schema({
   nome: {
      type: String
   },
   tipo: {
      type: String
   },
   user: {
      type: String
   },
   data: {
      type: String
   },
   hora: {
      type: String
   },
   data_registro: {
      type: Date,
      default: Date.now
   }
});

module.exports = mongoose.model('Distribuicao', distribuicaoSchema);