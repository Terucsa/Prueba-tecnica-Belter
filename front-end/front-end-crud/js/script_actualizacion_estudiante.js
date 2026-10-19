const modalEditar = new bootstrap.Modal(document.getElementById('modalEditar'));

function abrirModalEditar(id, nombre, carrera) {
    document.getElementById('edit_id_estudiante').value = id;
    document.getElementById('edit_nombre_estudiante').value = nombre;
    document.getElementById('edit_carrera_estudiante').value = carrera;
    modalEditar.show();
}

document.getElementById('formActualizar').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit_id_estudiante').value;
    const payload = {
    nombre_estudiante: document.getElementById('edit_nombre_estudiante').value,
    carrera_estudiante: document.getElementById('edit_carrera_estudiante').value
    };

    // Aquí consumirás el endpoint PUT /estudiantes/:id en Express
    console.log('Actualizando ID:', id, payload);
    modalEditar.hide();
});

async function eliminarEstudiante(id) {
  if (!confirm('¿Desea desinscribir a este estudiante?')) return;

  try {
    const response = await fetch(`http://localhost:3001/estudiantes/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Estudiante desinscrito correctamente');
      cargarEstudiantesInscritos(); // Recarga la lista (como el GET solo trae inscripcion_estudiante = 1, la card desaparecerá)
    } else {
      const errorData = await response.json();
      alert(errorData.message || 'Error al desinscribir');
    }
  } catch (error) {
    console.error('Error en la desinscripción:', error);
    alert('No se pudo conectar con el servidor.');
  }
}

async function cargarEstudiantesInscritos() {
  try {
    const response = await fetch('http://localhost:3001/estudiantes');
    const estudiantes = await response.json();

    const contenedor = document.getElementById('contenedorCards');
    contenedor.innerHTML = '';

    if (estudiantes.length === 0) {
      contenedor.innerHTML = `<div class="col-12"><p class="text-center text-muted">No hay estudiantes inscritos actualmente.</p></div>`;
      return;
    }

    estudiantes.forEach(est => {
      const cardHTML = `
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title fw-bold mb-0">${est.nombre_estudiante}</h5>
                <span class="badge bg-success">Inscrito</span>
              </div>
              <p class="text-muted mb-1"><i class="bi bi-book me-1"></i> ${est.carrera_estudiante}</p>
              <p class="text-muted small mb-0"><i class="bi bi-calendar me-1"></i> Edad: ${est.edad_estudiante} años</p>
            </div>
            <div class="card-footer bg-white border-0 pt-0 pb-4 px-4 d-flex gap-2">
              <button class="btn btn-outline-primary btn-sm w-100" onclick="abrirModalEditar(${est.id}, '${est.nombre_estudiante}', '${est.carrera_estudiante}')">
                <i class="bi bi-pencil me-1"></i> Actualizar
              </button>
              <button class="btn btn-outline-danger btn-sm w-100" onclick="eliminarEstudiante(${est.id})">
                <i class="bi bi-trash me-1"></i> Desinscribir
              </button>
            </div>
          </div>
        </div>
      `;
      contenedor.innerHTML += cardHTML;
    });

  } catch (error) {
    console.error('Error al cargar la lista de estudiantes:', error);
  }
}
document.addEventListener('DOMContentLoaded', cargarEstudiantesInscritos);


document.getElementById('formActualizar').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('edit_id_estudiante').value;
  const payload = {
    nombre_estudiante: document.getElementById('edit_nombre_estudiante').value,
    carrera_estudiante: document.getElementById('edit_carrera_estudiante').value
  };

  try {
    const response = await fetch(`http://localhost:3001/estudiantes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert('Estudiante actualizado correctamente');
      modalEditar.hide();
      cargarEstudiantesInscritos(); // Recargar la lista de cards
    } else {
      const errorData = await response.json();
      alert(errorData.message || 'Error al actualizar estudiante');
    }
  } catch (error) {
    console.error('Error en la petición de actualización:', error);
    alert('No se pudo conectar con el servidor.');
  }
});
