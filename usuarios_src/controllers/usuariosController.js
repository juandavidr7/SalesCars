// usuariosController.js
const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuariosModel");  // Solo importa la clase Usuario

// Registrar un usuario
router.post("/api/usuarios/register", async (req, res) => {
    const { email, nombre, telefono, contraseña } = req.body;

    try {
        // Verificar si el email ya existe
        const usuarioExistente = await Usuario.obtenerUsuarioPorEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ message: "El correo electrónico ya está registrado" });
        }

        // Registrar usuario sin encriptar la contraseña
        const result = await Usuario.registrarUsuario(email, nombre, telefono, contraseña);
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (err) {
        res.status(500).json({ message: "Error al registrar usuario", error: err });
    }
});

// Ruta de login simplificada
router.post('/api/usuarios/login', async (req, res) => {
    const { email, contraseña } = req.body;
    console.log('Intento de login con:', { email, contraseña });

    // Validar credenciales de administrador
    if (email === 'admin@example.com' && contraseña === '123') {
        return res.status(200).json({
            message: "Login exitoso",
            token: "token_admin",
            name: "Administrador",
            email: "admin@example.com",
            role: "admin",
            redirect: "/admin"
        });
    }

    // Validar credenciales de usuario normal
    if (email === 'user@example.com' && contraseña === '123') {
        return res.status(200).json({
            message: "Login exitoso",
            token: "token_user",
            name: "Usuario Normal",
            email: "user@example.com",
            role: "user",
            redirect: "/perfil"
        });
    }

    // Para cualquier otro usuario, devolver error
    return res.status(401).json({ message: "Credenciales incorrectas" });
});

// Obtener información del usuario
router.get("/api/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.obtenerUsuarioPorId(id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(usuario);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener usuario", error: err });
    }
});

// Ruta PUT para actualizar un usuario
router.put("/api/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    const { email, nombre, telefono, contraseña } = req.body;

    try {
        // Llamamos al método actualizarUsuario del modelo
        const result = await Usuario.actualizarUsuario(id, email, nombre, telefono, contraseña);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Datos actualizados exitosamente" });
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (err) {
        console.error("Error en la actualización de datos:", err);  // Depuración del error
        res.status(500).json({ message: "Error al actualizar datos", error: err.message });
    }
});

// Eliminar cuenta de usuario
router.delete("/api/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Usuario.eliminarUsuario(id);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Usuario eliminado exitosamente" });
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar cuenta", error: err });
    }
});

// Recuperación de contraseña (forgot-password)
router.post("/api/usuarios/forgot-password", async (req, res) => {
    // Lógica de recuperación de contraseña (podría ser mediante correo electrónico)
    res.status(200).json({ message: "Proceso de recuperación de contraseña iniciado" });
});

// Cerrar sesión
router.post("/api/usuarios/logout", (req, res) => {
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
});

// Cambiar contraseña
router.put("/api/usuarios/password-change", async (req, res) => {
    const { id, nuevaContraseña } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);
        const result = await Usuario.actualizarUsuario(id, null, null, null, hashedPassword);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Contraseña cambiada exitosamente" });
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error al cambiar contraseña", error: err });
    }
});

// Obtener todos los usuarios
router.get("/api/usuarios", async (req, res) => {
    try {
        // Usar el método obtenerTodosUsuarios de la clase Usuario
        const usuarios = await Usuario.obtenerTodosUsuarios();
        res.status(200).json(usuarios);  // Devolver la lista de usuarios
    } catch (err) {
        console.log('Error al obtener usuarios:', err);
        res.status(500).json({ message: "Error al obtener los usuarios", error: err });
    }
});

module.exports = router;
