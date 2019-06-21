'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var distribuicaoSchema = new Schema({
   logon: {
      type: String
   },
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
}, { versionKey: false });

distribuicaoSchema.index({logon: 1, nome: 1, tipo: 1, data: 1, hora: 1}, {unique: true})

module.exports = mongoose.model('Distribuicao', distribuicaoSchema);