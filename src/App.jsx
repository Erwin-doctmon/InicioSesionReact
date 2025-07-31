import React, { useState } from 'react';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [usuarios, setUsuarios] = useState([]);

  const handleRegistro = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, contrasena }),
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        setMensaje(`✅ ${data.message}`);
        setUsuario('');
        setContrasena('');
      } else {
        setMensaje(`❌ ${data.message}`);
      }
    } catch (error) {
      setMensaje('⚠️ Error al conectar con el servidor');
      console.error(error);
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/usuarios');
      const data = await respuesta.json();
      setUsuarios(data.usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const descargarJSON = () => {
    const datosJSON = JSON.stringify(usuarios, null, 2);
    const blob = new Blob([datosJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'usuarios.json';
    enlace.click();
    URL.revokeObjectURL(url);
  };

  const eliminarTodosUsuarios = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/usuarios', {
        method: 'DELETE',
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        setMensaje(data.message);
        setUsuarios([]);
      } else {
        setMensaje(`❌ ${data.message}`);
      }
    } catch (error) {
      setMensaje('⚠️ Error al conectar con el servidor');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2 className="titulo-login">🔒 INICIO DE SESIÓN</h2>

      <form className="formulario" onSubmit={handleRegistro}>
        <label htmlFor="usuario">Usuario:</label>
        <input
          type="text"
          id="usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />

        <label htmlFor="contrasena">Contraseña:</label>
        <div className="contrasena-container">
          <input
            type={mostrarContrasena ? 'text' : 'password'}
            id="contrasena"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
          <span
            className="emoji"
            onClick={() => setMostrarContrasena(!mostrarContrasena)}
          >
            {mostrarContrasena ? '🙈' : '👁️'}
          </span>
        </div>

        <button type="submit" className="boton-registrar">REGISTRAR</button>
      </form>

      {mensaje && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{mensaje}</p>}

      <button className="boton-ver" onClick={obtenerUsuarios} style={{ marginTop: '20px' }}>
        Ver usuarios registrados
      </button>

      {usuarios.length > 0 && (
        <>
          <ul style={{ marginTop: '10px', textAlign: 'left' }}>
            {usuarios.map((user) => (
              <li key={user.id}>🧑‍ {user.usuario}</li>
            ))}
          </ul>
          <button className="boton-descargar" onClick={descargarJSON} style={{ marginTop: '10px' }}>
            Descargar JSON
          </button>
          <button className="boton-eliminar" onClick={eliminarTodosUsuarios} style={{ marginTop: '10px' }}>
            Eliminar todos los usuarios
          </button>
        </>
      )}
    </div>
  );
}

export default App;
