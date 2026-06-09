const db = require('../config/db');

const buscarPorCorreo = (correo, callback) => {
  const sql = "SELECT * FROM usuarios WHERE correo = ?";
  db.query(sql, [correo], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results[0]);
  });
};

module.exports = { buscarPorCorreo };