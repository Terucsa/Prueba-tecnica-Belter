import { Router } from 'express';
import { getConnection, sql } from '../db/conection.js';
const router = Router();

router.post('/', async (req, res) => {
  const { nombre_estudiante, edad_estudiante, carrera_estudiante, inscripcion_estudiante } = req.body;

  if (!nombre_estudiante || !edad_estudiante || !carrera_estudiante || inscripcion_estudiante === undefined) {
    return res.status(400).json({ 
      message: 'Todos los campos son obligatorios (nombre_estudiante, edad_estudiante, carrera_estudiante, inscripcion_estudiante).' 
    });
  }

  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input('nombre_estudiante', sql.VarChar(100), nombre_estudiante)
      .input('edad_estudiante', sql.Int, edad_estudiante)
      .input('carrera_estudiante', sql.VarChar(100), carrera_estudiante)
      .input('inscripcion_estudiante', sql.Bit, Boolean(inscripcion_estudiante)) // sql.Bit convierte el booleano (true/false) a 1/0
      .execute('sp_InsertarEstudiante');

    const nuevoId = result.recordset[0].id;

    res.status(201).json({
      message: 'Estudiante registrado con éxito',
      estudiante: {
        id: nuevoId,
        nombre_estudiante,
        edad_estudiante,
        carrera_estudiante,
        inscripcion_estudiante: Boolean(inscripcion_estudiante)
      }
    });

  } catch (error) {
    console.error('Error al insertar el estudiante:', error);
    res.status(500).json({ message: 'Error interno del servidor al guardar el estudiante' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre_estudiante, carrera_estudiante } = req.body;

  if (!nombre_estudiante || !carrera_estudiante) {
    return res.status(400).json({ 
      message: 'Los campos nombre_estudiante y carrera_estudiante son requeridos.' 
    });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('nombre_estudiante', sql.VarChar(100), nombre_estudiante)
      .input('carrera_estudiante', sql.VarChar(100), carrera_estudiante)
      .execute('sp_ActualizarEstudiante');

    const filasAfectadas = result.recordset[0].filas_afectadas;

    if (filasAfectadas === 0) {
      return res.status(404).json({ message: 'Estudiante no encontrado.' });
    }

    res.status(200).json({
      message: 'Estudiante actualizado con éxito',
      estudiante: {
        id: Number(id),
        nombre_estudiante,
        carrera_estudiante
      }
    });

  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar el estudiante' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input('id', sql.Int, id)
      .execute('sp_DesinscribirEstudiante');

    const filasAfectadas = result.recordset[0].filas_afectadas;

    if (filasAfectadas === 0) {
      return res.status(404).json({ message: 'Estudiante no encontrado.' });
    }

    res.status(200).json({
      message: 'Estudiante desinscrito con éxito',
      id: Number(id)
    });

  } catch (error) {
    console.error('Error al desinscribir estudiante:', error);
    res.status(500).json({ message: 'Error interno del servidor al desinscribir el estudiante' });
  }
});


router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().execute('sp_ObtenerEstudiantesInscritos');
    const estudiantes = result.recordset.map(estudiante => ({
      ...estudiante,
      inscripcion_estudiante: Boolean(estudiante.inscripcion_estudiante)
    }));

    res.status(200).json(estudiantes);

  } catch (error) {
    console.error('Error al obtener estudiantes inscritos:', error);
    res.status(500).json({ message: 'Error interno del servidor al consultar estudiantes' });
  }
});



export default router;