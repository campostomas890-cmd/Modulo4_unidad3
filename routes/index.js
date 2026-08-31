var express = require('express');
var router = express.Router();
var pool = require('../models/bd');

/* GET home page. */
router.get('/', function(req, res, next) {
  pool.query('SELECT * FROM empleados')
    .then(function(rows) {
      var empleados = rows.map(function(row) {
        return JSON.stringify(row, null, 2);
      });

      res.render('index', { title: 'Empleados', empleados: empleados });
    })
    .catch(function(error) {
      console.error(error);
      next(error);
    });
});

module.exports = router;
