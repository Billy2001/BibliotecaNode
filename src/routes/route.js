'use strict'
var express=require('express');
var ControllerUser=require('../controller/userController');
var LibroController=require('../controller/librosController');
var RevistaController=require('../controller/RevistaController');
var UserNormal=require('../controller/UsuarioNormalController');
var md_auth = require('../middleware/authenticated');


let api= express.Router();

// RUTAS//

/*Usuario */
api.post('/login', ControllerUser.login);
api.post('/crearUser/:UserId',md_auth.ensureAuth,ControllerUser.insertUser);
api.put('/edit/:UserId',md_auth.ensureAuth,ControllerUser.editUser);
api.delete('/delete/:UserId',md_auth.ensureAuth,ControllerUser.eliminarUser);
api.get('/Usuarios/:UserId',md_auth.ensureAuth,ControllerUser.getUsers)

/*Libros*/
api.post('/ingresarLibro/:UserId',md_auth.ensureAuth,LibroController.agregarLibro);
api.put('/editLibro/:UserId',md_auth.ensureAuth,LibroController.editLibro);
api.delete('/eliminarLibro/:UserId',md_auth.ensureAuth,LibroController.eliminarLibro);
api.get('/Libros/:UserId',md_auth.ensureAuth,LibroController.getLibros);

/*Revistas*/
api.post('/ingresarRevista/:UserId', md_auth.ensureAuth,RevistaController.agregarRevista);
api.put('/editarRevista/:UserId',md_auth.ensureAuth, RevistaController.editarRevista);
api.delete('/eliminarRevista/:UserId',md_auth.ensureAuth,RevistaController.eliminarRevista);
api.get('/obtenerRevistas/:UserId',md_auth.ensureAuth,RevistaController.obtenerRevista);

/*Usuario Normal*/
api.post('/prestarLibro',md_auth.ensureAuth,UserNormal.PrestarLibro);
api.post('/prestarRevista',md_auth.ensureAuth,UserNormal.PrestarRevista);
module.exports = api;