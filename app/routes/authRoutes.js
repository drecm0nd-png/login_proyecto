const express = require('express');
const router = express.Router();
const { registro, login, recuperarContrasena, restablecerContrasena } = require('../controllers/authController');

router.post('/register', registro);
router.post('/login', login);
router.post('/recuperar', recuperarContrasena);
router.post('/restablecer', restablecerContrasena);

module.exports = router;