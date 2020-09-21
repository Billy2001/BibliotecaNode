"use strict";
var Libro = require("../models/Libros");
var Revista = require("../models/Revistas");
var User = require("../models/Users");

function PrestarLibro(req, res) {
  let params = req.body;
  let IdUsuario = req.params.UserId;
  let titulo = params.titulo;
  let edicion = params.edicion;

  if (IdUsuario != req.user.sub) {
    return res
      .status(500)
      .send({ message: "No tiene permiso para realizar esta petición" });
  }
  User.findById(
    req.user.sub,
    { RevistaLibros: 1, _id: 0 },
    (err, Comprobar) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "No se pudo realizar la petición" });
      }
      if (Comprobar.length === 10) {
        return res.status(404).send({ message: "ya no puede prestar más" });
      } else {
        Libro.find({ $or: [{ titulo }, { edicion }] }).exec((err, Buscar) => {
          if (err) {
            return res
              .status(500)
              .send({ message: "No se pudo realizar la petición" });
          }
          if (Buscar) {
            User.findByIdAndUpdate(
              req.user.sub,
              {
                $push: {
                  RevistaLibros: {
                    tituloRevistaOLibro: titulo,
                    edicionRevistaOLibro: edicion
                  },
                },
              },
              (err, LibroPrestado) => {
                if (err) {
                  return res
                    .status(500)
                    .send({ message: "No se pudo realizar la petición 1" });
                }
                if (LibroPrestado) {
                  console.log(LibroPrestado);
                  User.updateOne(
                    req.user.sub,
                    { $inc: { [NumeroDePrestamo]: 1 } },
                    (err, listo) => {
                      if (err) {
                        return res
                          .status(500)
                          .send({
                            message: "No se pudo realizar la petición 2",
                          });
                      }
                      if (listo) {
                        Libro.updateOne(
                          Buscar._id,
                          { $inc: { [disponibles]: -1 } },
                          (err, listo2) => {
                            if (err) {
                              return res
                                .status(500)
                                .send({
                                  message: "No se pudo realizar la petición 3",
                                });
                            }
                            if (listo2) {
                              return res.status(200).send({ Libro: Buscar });
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          } else {
            return res
              .status(404)
              .send({ message: "No se pudo encontrar el usuario" });
          }
        });
      }
    }
  );
}

module.exports = {
  PrestarLibro
  
};
