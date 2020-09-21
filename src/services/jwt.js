"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "clave_secreta";

exports.createToken = function (user) {
  var payload = {
    sub: user._id,
    carnet_CUI: user.carnet_CUI,
    usuario: user.usuario,
    nombre: user.nombre,
    apellido: user.apellido,
    Rol: user.Rol,
    iat: moment().unix(),
    exp: moment().day(30, "day").unix(),
  };
  return jwt.encode(payload, secret);
};
