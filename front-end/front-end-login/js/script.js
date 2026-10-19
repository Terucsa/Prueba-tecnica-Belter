document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const nombre_usuario = document.getElementById('nombre_usuario').value;
    const contrasenia_usuario = document.getElementById('contrasenia_usuario').value;

    if ( !nombre_usuario || !contrasenia_usuario) {
        alert("Debes llenar los dos campos para iniciar sesión");
    }

    const credentials = {
      nombre_usuario: nombre_usuario,
      contrasenia_usuario: contrasenia_usuario
    };

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();

      if (response.ok) {
        console.log('Login exitoso:', data);
        alert('Inicio de sesión correcto');
      } else {
        console.error('Error en las credenciales:', data);
        alert(data.message || 'Error al iniciar sesión');
      }

    } catch (error) {
      console.error('Error de conexión con el servidor:', error);
      alert('No se pudo conectar con el servidor.');
    }
  });