require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./app/config/db');

const app = express();
app.set("port", process.env.PORT || 4000);

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "app/public")));

// Sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto123',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true en producción con HTTPS
}));

// Rutas páginas
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "app/pages/login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "app/pages/register.html")));

// Rutas auth
const authRoutes = require('./app/routes/authRoutes');
app.use('/auth', authRoutes);

// Iniciar servidor
app.listen(app.get("port"), () => {
  console.log("Servidor corriendo en el puerto", app.get("port"));
});