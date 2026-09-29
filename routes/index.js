var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    contactoEnviado: req.query.contacto === 'enviado',
    contactoError: req.query.contacto === 'error'
  });
});

module.exports = router;
