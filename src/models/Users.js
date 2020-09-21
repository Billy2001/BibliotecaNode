"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var UserSchema = Schema({
  carnet_CUI: String,
  usuario: String,
  nombre: String,
  apellido: String,
  Rol: String,
  password: String,
  NumeroDePrestamo:Number,
  RevistaLibros:[
    {
      tituloRevistaOLibro:{type:String,require:true},
      edicionRevistaOLibro:{type:String,requiere:true}      
    }    
  ]
});
module.exports = mongoose.model("user", UserSchema);
