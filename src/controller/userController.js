"use strict";
var User = require("../models/Users");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");

function login(req, res) {
  let params = req.body;
  let usuario = new User();
  let rol = "admin";
  User.find({ Rol: rol }, { Rol: 1, _id: 0 }, (err, adminEncontrado) => {
    if (err) {
      return console.log("No se pudo realizar la petición");
    } else if (adminEncontrado.length >= 1) {
      User.findOne({ usuario: params.usuario }, (err, user) => {
        if (err)
          return res.status(500).send({ message: "Error en la peticion" });
        if (user) {
          bcrypt.compare(params.password, user.password, (err, check) => {
            if (check) {
              if (params.gettoken) {
                return res.status(200).send({ token: jwt.createToken(user) });
              } else {
                user.password = undefined;
                return res.status(200).send({ user });
              }
            } else {
              return res
                .status(404)
                .send({ message: "El usuario no se ha podido identificar" });
            }
          });
        } else {
          return res
            .status(404)
            .send({ message: "El usuario no se ha podido logear" });
        }
      });
    } else if (adminEncontrado.length === 0) {
      usuario.usuario = "admin";
      usuario.nombre = "admin";
      usuario.Rol = "admin";
      usuario.password = "admin";
      bcrypt.hash(usuario.password, null, null, (err, hash) => {
        usuario.password = hash;
        usuario.save((err, Guardar) => {
          if (err) {
            return console.log("No se pudo guardar el usuario");
          }
          if (Guardar) {
            User.findOne({ usuario: params.usuario }, (err, user) => {
              if (err)
                return res
                  .status(500)
                  .send({ message: "Error en la peticion" });
              if (user) {
                bcrypt.compare(params.password, user.password, (err, check) => {
                  if (check) {
                    if (params.gettoken) {
                      return res
                        .status(200)
                        .send({ token: jwt.createToken(user) });
                    } else {
                      user.password = undefined;
                      return res.status(200).send({ user });
                    }
                  } else {
                    return res
                      .status(404)
                      .send({
                        message: "El usuario no se ha podido identificar",
                      });
                  }
                });
              } else {
                return res
                  .status(404)
                  .send({ message: "El usuario no se ha podido logear" });
              }
            });
          } else {
            return console.log("No se pudo guardar el administrador");
          }
        });
      });
    }
  });
}

function insertUser(req, res) {
  let user = new User();
  let params = req.body;
  let IdUser = req.params.UserId;
  if (IdUser != req.user.sub) {
    return res
      .status(500)
      .send({ message: "No tiene los permisos para agregar este usuario" });
  }
  User.findById(IdUser, (err, AdminEncontrado) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "No se pudo realizar la petición" });
    }
    if (!AdminEncontrado) {
      return res
        .status(404)
        .send({ message: "Compruebe si existe el administrador" });
    }
    if (AdminEncontrado.Rol === "admin") {
      if (
        params.carnet_CUI &&
        params.usuario &&
        params.nombre &&
        params.apellido &&
        params.password
      ) {
        user.carnet_CUI = params.carnet_CUI;
        user.usuario = params.usuario;
        user.nombre = params.nombre;
        user.apellido = params.apellido;
        user.Rol = "estudiante";

        User.find({
          $or: [{ carnet_CUI: params.carnet_CUI }, { usuario: params.usuario }],
        }).exec((err, verificacion) => {
          if (err) {
            return res
              .status(500)
              .send({ message: "No se pudo realizar la petición" });
          }
          if (verificacion && verificacion.length >= 1) {
            return res.status(500).send({ message: "Ya existeeste Usuario" });
          } else {
            bcrypt.hash(params.password, null, null, (err, hash) => {
              user.password = hash;
              user.save((err, Guardar) => {
                if (err) {
                  return res
                    .status(500)
                    .send({ message: "No se pudo guardar el usuario" });
                }
                if (Guardar) {
                  return res.status(200).send({ user: Guardar });
                } else {
                  return res
                    .status(404)
                    .send({ message: "No se ha podido registrar el usuario" });
                }
              });
            });
          }
        });
      } else {
        return res
          .status(200)
          .send({ message: "Rellene todos los datos necesarios" });
      }
    } else {
      return res
        .status(404)
        .send({ message: "No tienes los permisos para realizar la petición" });
    }
  });
}
function editUser(req, res) {
  let params = req.body;
  let IdUser = req.params.UserId;
  let carnet = params.carnet_CUI;
  if (IdUser != req.user.sub) {
    return res
      .status(500)
      .send({ message: "No tiene los permisos para actualizar este usuario" });
  }

  User.findById(IdUser, (err, Busca) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "no se puede realizar la petición" });
    }
    if (!Busca) {
      return res.status(404).send({ message: "Compruebe si es administrador" });
    }
    if (Busca.Rol === "admin") {
      User.findOneAndUpdate(carnet, params, (err, UsuarioEditado) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "No se pudo realizar la petición" });
        }
        if (UsuarioEditado) {
          return res.status(200).send({ Actualizado: params });
        } else {
          return res
            .status(404)
            .send({ message: "No se pudo actualizar el usuario" });
        }
      });
    } else {
      return res
        .status(404)
        .send({ message: "No tienes los permisos para realizar la petición" });
    }
  });
}
function eliminarUser(req, res) {
  let params = req.body;
  let IdUser = req.params.UserId;
  let carnet = params.carnet_CUI;

  if (IdUser != req.user.sub) {
    return res
      .status(500)
      .send({ message: "No tiene los permisos para actualizar este usuario" });
  }
  User.findById(IdUser, (err, AdminEncontrado) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "No se puede realizar la petición" });
    }
    if (!AdminEncontrado) {
      return res
        .status(404)
        .send({ message: "Compruebe si existe el administrador" });
    }
    if (AdminEncontrado.Rol === "admin") {
      User.findOneAndDelete(carnet, (err, UsuarioEliminado) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "No se pudo realizar la petición" });
        }
        if (UsuarioEliminado) {
          return res.status(200).send({ UsuarioElimando: UsuarioEliminado });
        } else {
          return res
            .status(400)
            .send({ message: "No se pudo eliminar el usuario" });
        }
      });
    } else {
      return res
        .status(404)
        .send({ message: "No tienes los permisos para realizar la petición" });
    }
  });
}
function getUsers(req, res) {
  let params = req.body;
  let IdUser = req.params.UserId;
  if (IdUser != req.user.sub) {
    return res
      .status(500)
      .send({ message: "No tiene los permisos para ver estos usuarios" });
  }
  User.findById(IdUser, (err, AdminEncontrado) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "No se pudo realizar la petición" });
    }
    if (!AdminEncontrado) {
      return res
        .status(404)
        .send({ message: "Compruebe si existe el administrador" });
    }
    if (AdminEncontrado.Rol === "admin") {
      User.find((err, TodosLosUsuario) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "No se pudo realizar la petición" });
        }
        if (TodosLosUsuario) {
          return res.status(200).send({ TodosLosUsuario });
        }
      });
    } else {
      return res
        .status(404)
        .send({ message: "No tienes los permisos para realizar la petición" });
    }
  });
}
module.exports = {
  insertUser,
  login,
  editUser,
  eliminarUser,
  getUsers,
};
