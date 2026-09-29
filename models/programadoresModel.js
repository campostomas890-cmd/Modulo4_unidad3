var pool = require('./bd');

async function getProgramadores() {
  var query = 'SELECT * FROM novedades ORDER BY id DESC';
  var rows = await pool.query(query);
  return rows;
}

async function getProgramadorById(id) {
  var query = 'SELECT * FROM novedades WHERE id = ? LIMIT 1';
  var rows = await pool.query(query, [id]);
  return rows[0];
}

async function searchProgramadores(texto) {
  var query = 'SELECT * FROM novedades WHERE titulo LIKE ? OR subtitulo LIKE ? OR cuerpo LIKE ? ORDER BY id DESC';
  var buscar = '%' + texto + '%';
  var rows = await pool.query(query, [buscar, buscar, buscar]);
  return rows;
}

async function insertProgramador(obj) {
  var query = 'INSERT INTO novedades (titulo, subtitulo, cuerpo, img_id) VALUES (?, ?, ?, ?)';
  var rows = await pool.query(query, [obj.titulo, obj.subtitulo, obj.cuerpo, obj.img_id || null]);
  return rows;
}

async function updateProgramadorById(id, obj) {
  var query = 'UPDATE novedades SET titulo = ?, subtitulo = ?, cuerpo = ?, img_id = ? WHERE id = ?';
  var rows = await pool.query(query, [obj.titulo, obj.subtitulo, obj.cuerpo, obj.img_id || null, id]);
  return rows;
}

async function deleteProgramadorById(id) {
  var query = 'DELETE FROM novedades WHERE id = ?';
  var rows = await pool.query(query, [id]);
  return rows;
}

module.exports = {
  getProgramadores,
  getProgramadorById,
  searchProgramadores,
  insertProgramador,
  updateProgramadorById,
  deleteProgramadorById
};
