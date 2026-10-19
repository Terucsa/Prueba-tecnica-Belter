import { Router } from 'express';
import { getConnection, sql } from '../db/conection.js';
const router = Router();

router.post('/', async (req, res) => {
    const { nombre_usuario, contrasenia_usuario} = req.body;

    if (!nombre_usuario || !contrasenia_usuario) {
        return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
    }

    try {
    const pool = await getConnection();
    const result = await pool.request()
        .input('nombre_usuario', sql.VarChar(50), nombre_usuario)
        .input('contrasenia_usuario', sql.VarChar(255), contrasenia_usuario)
        .execute('sp_ValidarUsuario');

    if (result.recordset.length === 0) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.recordset[0];

    res.status(200).json({
        message: 'Inicio de sesión exitoso',
        user: {
        id: user.id,
        nombre_usuario: user.nombre_usuario
        }
    });

    } catch (error) {
    console.error('Error al ejecutar el procedimiento almacenado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
    }
});


export default router;