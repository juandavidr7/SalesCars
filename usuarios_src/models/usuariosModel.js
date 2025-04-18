// usuariosModel.js
const mysql = require("mysql2/promise");

// Configurar la conexión a la base de datos
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "", // Deja esto vacío si no tienes contraseña
    database: "concesionario",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    authPlugins: {
        mysql_native_password: () => () => Buffer.from('')
    }
});

// Función para probar la conexión
async function testConnection() {
    try {
        console.log('🔍 Intentando conectar a MariaDB...');
        const conn = await connection.getConnection();
        console.log('✅ Conexión exitosa a MariaDB');
        
        // Probar una consulta simple
        const [rows] = await conn.query('SELECT 1 as test');
        console.log('✅ Consulta de prueba exitosa:', rows);
        
        // Verificar la base de datos
        const [dbs] = await conn.query('SHOW DATABASES');
        console.log('📊 Bases de datos disponibles:', dbs.map(db => db.Database));
        
        // Verificar la tabla usuarios
        const [tables] = await conn.query('SHOW TABLES FROM concesionario');
        console.log('📋 Tablas en concesionario:', tables);
        
        conn.release();
    } catch (error) {
        console.error('❌ Error de conexión:', error);
    }
}

// Ejecutar la prueba de conexión
testConnection();

// Definir la clase Usuario
class Usuario {
    constructor(id, email, nombre, telefono, contraseña) {
        this.id = id;
        this.email = email;
        this.nombre = nombre;
        this.telefono = telefono;
        this.contraseña = contraseña;
    }

    // Método para guardar usuario en la base de datos
    static async registrarUsuario(email, nombre, telefono, contraseña) {
        const [result] = await connection.execute(
            'INSERT INTO usuarios (email, nombre, telefono, contraseña) VALUES (?, ?, ?, ?)',
            [email, nombre, telefono, contraseña]  // Sin encriptar la contraseña
        );
        return result;
    }

    // Método para obtener un usuario por email
    static async obtenerUsuarioPorEmail(email) {
        try {
            console.log('Buscando usuario con email:', email);
            const [rows] = await connection.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
            console.log('Resultado de la búsqueda:', rows);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar usuario por email:', error);
            throw error;
        }
    }

    // Método para obtener un usuario por id
    static async obtenerUsuarioPorId(id) {
        const [rows] = await connection.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
        return rows[0];
    }

// Método para actualizar un usuario 
static async actualizarUsuario(id, email, nombre, telefono, contraseña) {
    const [result] = await connection.execute(
        'UPDATE usuarios SET email = ?, nombre = ?, telefono = ?, contraseña = ? WHERE id = ?',
        [email, nombre, telefono, contraseña, id]
    );
    return result;
}

    // Método para eliminar usuario por id
    static async eliminarUsuario(id) {
    const [result] = await connection.execute('DELETE FROM usuarios WHERE id = ?', [id]);
    return result;
}

    // Método para obtener todos los usuarios
    static async obtenerTodosUsuarios() {
    const [rows] = await connection.execute('SELECT * FROM usuarios');
    return rows;  // Retorna todos los usuarios
}
}

// Exportar la clase Usuario correctamente
module.exports = Usuario;
