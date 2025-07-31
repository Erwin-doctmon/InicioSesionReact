const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors'); // Para permitir conexión con React

const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.json());
app.use(cors()); // Permitir que React acceda a la API

// Conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login_php' // Nombre de la BD
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a la BD:', err);
        return;
    }
    console.log('✅ Conexión exitosa a la BD');
});

// Ruta REGISTER (Registrar usuario)
app.post('/register', (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).json({ message: 'Faltan datos' });
    }

    // Verificar si el usuario ya existe
    const checkQuery = 'SELECT * FROM usuarios WHERE usuario = ?';
    db.query(checkQuery, [usuario], (err, results) => {
        if (err) {
            console.error('❌ Error en la verificación:', err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: 'El usuario ya existe' });
        }

        // Insertar un nuevo usuario
        const insertQuery = 'INSERT INTO usuarios (usuario, contrasena) VALUES (?, ?)';
        db.query(insertQuery, [usuario, contrasena], (err) => {
            if (err) {
                console.error('❌ Error al registrar usuario:', err);
                return res.status(500).json({ message: 'Error interno al registrar' });
            }

            res.json({ message: '✅ Usuario registrado exitosamente' });
        });
    });
});

// Ruta LOGIN (Iniciar sesión)
app.post('/login', (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).json({ message: 'Faltan datos' });
    }

    const query = 'SELECT * FROM usuarios WHERE usuario = ?';
    db.query(query, [usuario], (err, results) => {
        if (err) {
            console.error('❌ Error en la consulta:', err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const user = results[0];
        if (user.contrasena === contrasena) {
            res.json({ message: '✅ Autenticación satisfactoria' });
        } else {
            res.status(401).json({ message: '❌ Contraseña incorrecta' });
        }
    });
});

// Ruta GET para listar todos los usuarios (sin contraseñas)
app.get('/usuarios', (req, res) => {
    const query = 'SELECT id, usuario FROM usuarios';
    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error al obtener usuarios:', err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        res.json({ usuarios: results });
    });
});

// Ruta DELETE para eliminar todos los usuarios
app.delete('/usuarios', (req, res) => {
    const deleteQuery = 'DELETE FROM usuarios';
    db.query(deleteQuery, (err, result) => {
        if (err) {
            console.error('❌ Error al eliminar usuarios:', err);
            return res.status(500).json({ message: 'Error al eliminar usuarios' });
        }
        res.json({ message: '✅ Todos los usuarios han sido eliminados' });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});
