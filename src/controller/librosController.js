"use strict";
var Libro = require("../models/Libros");
var User = require("../models/Users");
function agregarLibro(req, res) {
  let libro = Libro();
  let params = req.body;
  let IdUser = req.params.UserId;

  if (IdUser != req.user.sub) {
    return res
      .status(500)
      .send({ message: "No tienes los permisos para agregar este libro" });
  }
  User.findById(IdUser, (err, AdminEncontrado) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "No se pudo realizar la petición" });
    }
    if (!AdminEncontrado) {
      return res.status(404).send({ message: "Comprobe si es administrador" });
    }

    if (AdminEncontrado.Rol === "admin") {
      if (
        params.autor &&
        params.titulo &&
        params.edicion &&
        params.palabrasClave &&
        params.descripcion &&
        params.temas &&
        params.copias &&
        params.disponibles
      ) {
        libro.autor = params.autor;
        libro.titulo = params.titulo;
        libro.edicion = params.edicion;
        libro.palabrasClave = params.palabrasClave;
        libro.descripcion = params.descripcion;
        libro.temas = params.temas;
        libro.copias = params.copias;
        libro.disponibles = params.disponibles;
        Libro.find({
          $or: [{ titulo: params.titulo }, { edicion: params.edicion }],
        }).exec((err, verificación) => {
          if (err) {
            return res
              .status(500)
              .send({ message: "No se pudo realizar la petición" });
          }
          if (verificación.length >= 1) {
            return res.status(500).send({ message: "Ya existe este libro" });
          } else {
            libro.save((err, LibroGuardado) => {
              if (err) {
                return res.status(500).send({ message: "No se pudo realizar" });
              }
              if (LibroGuardado) {
                return res.status(200).send({ Libro: LibroGuardado });
              } else {
                return res
                  .status(404)
                  .send({ message: "No se pudo Guardar el Libro" });
              }
            });
          }
        });
      } else {
        return res
          .status(200)
          .send({ message: "Rellene todos los datos necesarios" });
      }
    }
  });
}
function editLibro(req, res) {
  let params = req.body;
  let IdUser = req.params.UserId;
  let IdLibro = params.id;
  if (IdUser != req.user.sub) {
    return res
      .status(500)
      .send({ message: "No tiene permiso para editar este libro" });
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
      Libro.findByIdAndUpdate(IdLibro, params, (err, libroEditado) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "No se pudo realizar la petición" });
        }
        if (libroEditado) {
          return res.status(200).send({ libroEditado });
        } else {
          return res
            .status(404)
            .send({ message: "No se pudo agregar el libro" });
        }
      });
    }
  });
}
function eliminarLibro(req, res) {
  let IdUser = req.params.UserId;
  let params = req.body;
  let IdLibro = params.id;
  if (IdUser != req.user.sub) {
    return res
      .status(500)
      .send({ message: "No tiene permisos para eliminar este libro" });
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
      Libro.findByIdAndDelete(IdLibro, (err, LibroEliminado) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "no se puede realizar esta petición" });
        }
        if (LibroEliminado) {
          return res.status(200).send({ Libro: LibroEliminado });
        } else {
          return res
            .status(404)
            .send({ message: "No se pudo editar el libro" });
        }
      });
    }
  });
}
function getLibros(req, res) {
  let IdUser = req.params.UserId;
  if (IdUser != req.user.sub) {
    return res
      .status(500)
      .send({ message: "No tiene los permisos para ver los libros" });
  }
  User.findById(IdUser, (err, AdminEncontrado) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "No se pudo realizr la petición" });
    }
    if (!AdminEncontrado) {
      return res
        .status(500)
        .send({ message: "Compruebe si existe el administrador" });
    }
    if (AdminEncontrado.Rol === "admin") {
      Libro.find((err, libros) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "No se pudo realizar la petición" });
        }
        if (libros) {
          return res.status(200).send({ libros });
        } else {
          return res
            .status(404)
            .send({ message: "No se pudo encontrar los libros" });
        }
      });
    }
  });
}
module.exports = {
  agregarLibro,
  editLibro,
  eliminarLibro,
  getLibros,
};
