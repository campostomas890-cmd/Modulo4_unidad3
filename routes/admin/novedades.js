var express = require('express');
var router = express.Router();
var path = require('path');
var programadoresModel = require('../../models/programadoresModel');

// Listar novedades
router.get('/', async function (req, res, next) {
  try {
    var query = req.query.q ? req.query.q.trim() : '';
    var programadores = query
      ? await programadoresModel.searchProgramadores(query)
      : await programadoresModel.getProgramadores();

    res.render('admin/novedades', {
      layout: 'admin/layout',
      programadores,
      usuario: req.session.nombre,
      is_search: query !== '',
      q: query
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Agregar novedad
router.post('/agregar', async function (req, res, next) {
  try {
    if (req.body.titulo && req.body.subtitulo && req.body.cuerpo) {
      let img_id = null;

      if (req.files && req.files.img_id) {
        const archivo = req.files.img_id;
        const nombreArchivo = Date.now() + '-' + archivo.name.replace(/\s+/g, '_');
        const ruta = path.join(__dirname, '../../public/images', nombreArchivo);

        await archivo.mv(ruta);
        img_id = nombreArchivo;
      }

      await programadoresModel.insertProgramador({
        titulo: req.body.titulo,
        subtitulo: req.body.subtitulo,
        cuerpo: req.body.cuerpo,
        img_id: img_id
      });

      res.redirect('/admin/novedades');
    } else {
      var programadores = await programadoresModel.getProgramadores();
      res.render('admin/novedades', {
        layout: 'admin/layout',
        programadores,
        usuario: req.session.nombre,
        error: true,
        message: 'Todos los campos son requeridos'
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Cargar formulario de edición
router.get('/editar/:id', async function (req, res, next) {
  try {
    var id = req.params.id;
    var programador = await programadoresModel.getProgramadorById(id);
    var programadores = await programadoresModel.getProgramadores();

    res.render('admin/novedades', {
      layout: 'admin/layout',
      programadores,
      programador,
      usuario: req.session.nombre
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Procesar edición
router.post('/editar/:id', async function (req, res, next) {
  try {
    var id = req.params.id;

    if (req.body.titulo !== '' && req.body.subtitulo !== '' && req.body.cuerpo !== '') {
      let img_id = req.body.img_id_actual || null;

      if (req.files && req.files.img_id) {
        const archivo = req.files.img_id;
        const nombreArchivo = Date.now() + '-' + archivo.name.replace(/\s+/g, '_');
        const ruta = path.join(__dirname, '../../public/images', nombreArchivo);

        await archivo.mv(ruta);
        img_id = nombreArchivo;
      }

      await programadoresModel.updateProgramadorById(id, {
        titulo: req.body.titulo,
        subtitulo: req.body.subtitulo,
        cuerpo: req.body.cuerpo,
        img_id: img_id
      });

      res.redirect('/admin/novedades');
    } else {
      var programador = await programadoresModel.getProgramadorById(id);
      var programadores = await programadoresModel.getProgramadores();
      res.render('admin/novedades', {
        layout: 'admin/layout',
        programadores,
        programador,
        usuario: req.session.nombre,
        error: true,
        message: 'Todos los campos son requeridos'
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Eliminar novedad
router.get('/eliminar/:id', async function (req, res, next) {
  try {
    var id = req.params.id;
    await programadoresModel.deleteProgramadorById(id);
    res.redirect('/admin/novedades');
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;