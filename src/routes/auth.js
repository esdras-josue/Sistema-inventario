/**
 * Archivo de rutas para la autenticacion.
 * Contiene el endpoint para reiniciar y generar un token JWT
 */
const express = require("express");
const jwt = require("jsonwebtoken");
const database = require("../database/connection");
const router = express.Router();
// Clave secreta para firmar los tokens JWT
const SECRET_KEY = "my_secret_key";

/**
 * LogIn
 * Metodo: POST
 * Ruta: /api/auth/login
 * Verifica las credenciales proporcionadas
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email y  password son obligatorios" });
  }

  const query = `SELECT id, full_name, role_id FROM users WHERE email = ? AND password = ? AND status = 'active'`;
  database.query(query, [email, password], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error en la base de datos", details: err.message });
    }

    if (results.length == 0) {
      return res.status(401).json({ error: "Credenciales invalidas" });
    }
    
    // Usuario encontrado: generar un Token JWT
    const user = results[0];
    const token = jwt.sign(
      { userId: user.userId, roleId: user.roleId, fullName: user.fullName },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({message: 'Autenticacion exitosa', token}); 
  });
});

module.exports = router;
