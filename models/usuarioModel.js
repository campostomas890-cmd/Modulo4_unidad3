var pool = require('./bd');
var md5 = require('md5');

// Función de login existente
async function getUserByUsernameAndPassword(user, password) {
  try {
    var query = 'SELECT * FROM usuarioycontraseñaprogramadores WHERE usuario = ? AND contraseña = ? LIMIT 1';
    var rows = await pool.query(query, [user, md5(password)]);
    return rows[0];
  } catch (error) {
    console.log(error);
  }
}

// NUEVA FUNCIÓN: Insertar un usuario registrado (Create)
async function insertUser(obj) {
  try {
    var query = 'INSERT INTO usuarioycontraseñaprogramadores (usuario, contraseña) VALUES (?, ?)';
    var rows = await pool.query(query, [obj.usuario, md5(obj.contraseña)]);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getUserByUsernameAndPassword, insertUser };