var express=require('express');
var router=express.Router();
var usuarioModel=require('../../models/usuarioModel');

//renderiza el formulario login
router.get('/',function(req,res,next){
  res.render('admin/login',{
    layout:'admin/layout'
  });
});

router.get('/registro', function(req, res, next) {
    res.render('admin/registro', {
        layout: 'admin/layout'
    });
});

//formulario login

router.post('/', async function(req, res, next) {
    try {
        var usuario = req.body.usuario;
        var password = req.body.contraseña;

        var data = await usuarioModel.getUserByUsernameAndPassword(usuario, password);
        if (data != undefined) {
            req.session.id_usuario = data.id;
            req.session.nombre = data.usuario;
            res.redirect('/admin/novedades');
        } else {
            res.render('admin/login', {
                layout: 'admin/layout',
                error: true
            });
        }
    } catch (error) {
        console.log(error);
    }
});

//logout
router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.render('admin/login', {
        layout: 'admin/layout'
    });
});

router.post('/registro', async function(req, res, next) {
    try {
        if (!req.body.usuario || !req.body.contraseña) {
            return res.render('admin/registro', {
                layout: 'admin/layout',
                error: true,
                message: 'Usuario y contraseña son obligatorios'
            });
        }

        await usuarioModel.insertUser(req.body);
        res.redirect('/admin/login');
    } catch (error) {
        next(error);
    }
});

module.exports = router;
