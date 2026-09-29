require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload');
var session = require('express-session');

// Importación de enrutadores
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contactoRouter = require('./routes/contacto');
var loginRouter = require('./routes/admin/login');
var adminNovedadesRouter = require('./routes/admin/novedades');

var app = express();

// 1. Configuración de la sesión (Debe ir antes de las rutas)
app.use(session({
  secret: 'palabrasupersecreta',
  cookie: { maxAge: null },
  resave: true,
  saveUninitialized: true
}));

// 2. Middleware de seguridad (secured)
var secured = async (req, res, next) => {
  try {
    if (req.session.id_usuario) {
      next();
    } else {
      res.redirect('/admin/login');
    }
  } catch (error) {
    console.log(error);
  }
};

// 3. Configuración de middlewares globales y lectura de formularios
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload());

// 4. Configuración del motor de vistas (Handlebars)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// 5. Registro de Rutas (Públicas y Privadas bien diferenciadas)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contacto', contactoRouter);

app.use('/admin/login', loginRouter);
app.use('/admin/novedades', secured, adminNovedadesRouter); // Protegida y unificada

// 6. Manejo de errores 404
app.use(function(req, res, next) {
  next(createError(404));
});

// 7. Manejador de errores general
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;