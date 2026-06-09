const bcrypt = require('bcrypt');
const { buscarPorCorreo } = require('../models/userModel');
const db = require('../config/db');
const crypto = require('crypto');

// REGISTRO
const registro = async (req, res) => {
  const { nombre, correo, telefono, contrasena } = req.body;

  buscarPorCorreo(correo, async (err, usuario) => {
    if (err) return res.status(500).json({ mensaje: "Error en el servidor" });
    if (usuario) return res.status(400).json({ mensaje: "El correo ya está registrado" });

    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const sql = "INSERT INTO usuarios (nombre, correo, telefono, contrasena) VALUES (?, ?, ?, ?)";

    db.query(sql, [nombre, correo, telefono, hashedPassword], (err) => {
      if (err) return res.status(500).json({ mensaje: "Error al registrar usuario" });
      res.status(201).json({ mensaje: "Usuario registrado con éxito" });
    });
  });
};

// LOGIN
const login = async (req, res) => {
  const { correo, contrasena } = req.body;

  buscarPorCorreo(correo, async (err, usuario) => {
    if (err) return res.status(500).json({ mensaje: "Error en el servidor" });
    if (!usuario) return res.status(400).json({ mensaje: "Correo o contraseña incorrectos" });

    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!coincide) return res.status(400).json({ mensaje: "Correo o contraseña incorrectos" });

    req.session.usuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo
    };

    res.status(200).json({ mensaje: "Login exitoso", nombre: usuario.nombre });
  });
};

// RECUPERAR CONTRASEÑA
const recuperarContrasena = (req, res) => {
  const { correo } = req.body;

  buscarPorCorreo(correo, (err, usuario) => {
    if (err) return res.status(500).json({ mensaje: "Error en el servidor" });
    if (!usuario) return res.status(400).json({ mensaje: "Correo no encontrado" });

    const token = crypto.randomBytes(32).toString('hex');
    const expiracion = new Date(Date.now() + 3600000); // 1 hora

    const sql = "UPDATE usuarios SET token_recuperacion = ?, token_expiracion = ? WHERE correo = ?";
    db.query(sql, [token, expiracion, correo], (err) => {
      if (err) return res.status(500).json({ mensaje: "Error al generar token" });
      // Aquí iría el envío de correo con nodemailer
      res.status(200).json({ mensaje: "Token generado", token }); // quitar token en producción
    });
  });
};

// RESTABLECER CONTRASEÑA
const restablecerContrasena = async (req, res) => {
  const { token, nuevaContrasena } = req.body;

  const sql = "SELECT * FROM usuarios WHERE token_recuperacion = ? AND token_expiracion > NOW()";
  db.query(sql, [token], async (err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error en el servidor" });
    if (results.length === 0) return res.status(400).json({ mensaje: "Token inválido o expirado" });

    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
    const sqlUpdate = "UPDATE usuarios SET contrasena = ?, token_recuperacion = NULL, token_expiracion = NULL WHERE token_recuperacion = ?";

    db.query(sqlUpdate, [hashedPassword, token], (err) => {
      if (err) return res.status(500).json({ mensaje: "Error al restablecer contraseña" });
      res.status(200).json({ mensaje: "Contraseña restablecida con éxito" });
    });
  });
};

module.exports = { registro, login, recuperarContrasena, restablecerContrasena };