document.getElementById('formEstudiante').addEventListener('submit', async (e) => {
    e.preventDefault();

    nombre_estudiante = document.getElementById('nombre_estudiante').value;
    edad_estudiante =  parseInt(document.getElementById('edad_estudiante').value);
    carrera_estudiante = document.getElementById('carrera_estudiante').value;
    inscripcion_estudiante = document.getElementById('inscripcion_estudiante').checked;

    if (!nombre_estudiante || !edad_estudiante || !carrera_estudiante ) {
        alert("Recuerda que debes llenar todos los campos para la inscripción");
    }
    
    const datos = {
    nombre_estudiante: nombre_estudiante,
    edad_estudiante:edad_estudiante,
    carrera_estudiante: carrera_estudiante,
    inscripcion_estudiante: inscripcion_estudiante,
    };

    try {
    const response = await fetch('http://localhost:3001/estudiantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    if (response.ok) {
        alert('Estudiante registrado correctamente');
        document.getElementById('formEstudiante').reset();
    }
    } catch (err) {
    console.error('Error al registrar:', err);
    }
});
