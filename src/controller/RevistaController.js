"use strict";
var Revista = require("../models/Revistas");
var User = require("../models/Users");
const e = require("express");

function agregarRevista(req, res) {
  let revista = Revista();
  let params = req.body;
  let IdUser = req.params.UserId;
  if (IdUser != req.user.sub) {
    return res
      .status(500)
      .send({ message: "Usted no tiene permiso para ingresar la Revista" });
  }

  User.findById(IdUser, (err, AdminEncontrado) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "No se pudo realizar la petición" });
    }
    if (!AdminEncontrado) {
      return res
        .status(500)
        .send({ message: "Compruebe si existe el administrador" });
    }
    if (AdminEncontrado.Rol === "admin") {
      if (
        params.autor &&
        params.titulo &&
        params.edicion &&
        params.palabrasClave &&
        params.descripcion &&
        params.temas &&
        params.frecuenciaActual &&
        params.ejemplares &&
        params.copias &&
        params.disponibles
      ) {
        revista.autor = params.autor;
        revista.titulo = params.titulo;
        revista.edicion = params.edicion;
        revista.palabrasClave = params.palabrasClave;
        revista.descripcion = params.palabrasClave;
        revista.temas = params.temas;
        revista.frecuenciaActual = params.frecuenciaActual;
        revista.ejemplares = params.ejemplares;
        revista.copias = params.copias;
        revista.disponibles = params.disponibles;
        Revista.find({
          $or: [{ titulo: params.titulo }, { edicion: params.edicion }],
        }).exec((err, verificiacion) => {
          if (err) {
            return res
              .status(500)
              .send({ message: "No se pudo realizar la petición" });
          }
          if (verificiacion.length >= 1) {
            return res.status(500).send({ message: "La revista ya existe" });
          } else {
            revista.save((err, Guardado) => {
              if (err) {
                return res
                  .status(500)
                  .send({ message: "No se pudo realizar esta operación" });
              }
              if (Guardado) {
                return res.status(200).send({ Revista: Guardado });
              } else {
                return res
                  .status(404)
                  .send({ message: "No se pudo guardar la revista" });
              }
            });
          }
        });
      } else {
        return res
          .status(200)
          .send({ message: "Rellenen todos los datos necesarios" });
      }
    }
  });
}
function editarRevista(req, res) {
  let params = req.body;
  let IdUser = req.params.UserId;
  let IdRevista = params.id;

  if (IdUser != req.user.sub) {
    return res
      .status(500)
      .send({ message: "No tiene permiso para exitar esta Revista" });
  }
  User.findById(IdUser, (err, AdminEncontrado) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "No se pudo realizar la petición" });
    }
    if (!AdminEncontrado) {
      return res
        .status(500)
        .send({ message: "No tiene permiso para realizar esta petición" });
    }
    if (AdminEncontrado.Rol === "admin") {
      Revista.findByIdAndUpdate(IdRevista, params, (err, revistaEditada) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "No se puedo realizar la petición1" });
        }
        if (revistaEditada) {
          return res.status(200).send({ Revista: revistaEditada });
        } else {
          return res
            .status(404)
            .send({ message: "No se pudo editar la revista" });
        }
      });
    } else {
      return res
        .status(500)
        .send({ message: "No tiene los permisos para editar la revista" });
    }
  });
}
function eliminarRevista(req, res) {
  let params = req.body;
  let IdUser = req.params.UserId;
  let IdRevista = params.id;

  if (IdUser != req.user.sub) {
    return res
      .status(500)
      .send({ message: "No tiene permiso para realizar esta operación" });
  }
  User.findById(IdUser, (err, AdminEncontrado) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "No se puede realizar la petición" });
    }
    if (!AdminEncontrado) {
      return res
        .status(500)
        .send({ message: "No tiene permiso para realizar esta petición" });
    }
    if (AdminEncontrado.Rol === "admin") {
      Revista.findByIdAndDelete(IdRevista, (err, RevistaEliminada) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "No se puede realizar la petición" });
        }
        if (RevistaEliminada) {
          return res.status(200).send({ Revista: RevistaEliminada });
        } else {
          return res
            .status(404)
            .send({ message: "No se pudo eliminar la revista" });
        }
      });
    } else {
      return res
        .status(404)
        .send({ message: "No tiene permiso para realizar esta operación" });
    }
  });
}
function obtenerRevista(req, res) {
  let params = req.body;
  let IdUser = req.params.UserId;
  if (IdUser != req.user.sub) {
    return res
      .status(500)
      .send({ message: "No tiene permiso para realizar esta gestión" });
  }
  User.findById(IdUser, (err, AdminEncontrado) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "No se pudo realizar está petición" });
    }
    if (!AdminEncontrado) {
      return res
        .status(500)
        .send({ message: "No tiene permiso para realizar esta operación" });
    }
    if (AdminEncontrado.Rol === "admin") {
      Revista.find((err, Buscar) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "No se pudo realizar la petición" });
        }
        if (Buscar) {
          return res.status(200).send({ Revistas: Buscar });
        } else {
          return res
            .status(404)
            .send({ message: "No se pudo encontrar las Revistas" });
        }
      });
    } else {
      return res
        .status(404)
        .send({ message: "No tiene permisos para obtener las revistas" });
    }
  });
}
module.exports = {
  agregarRevista,
  editarRevista,
  eliminarRevista,
  obtenerRevista,
};
