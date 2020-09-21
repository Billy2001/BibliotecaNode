"use strict";
var mongoose = require("mongoose");

let Schema = mongoose.Schema;
let RevistaSchema = Schema({
  autor: String,
  titulo: String,
  edicion: String,
  palabrasClave: String,
  descripcion: String,
  temas: String,
  frecuenciaActual: String,
  ejemplares: String,
  copias: Number,
  disponibles: Number,
});
module.exports = mongoose.model("rebista", RevistaSchema);
