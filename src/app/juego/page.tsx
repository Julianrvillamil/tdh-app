'use client';
import { useEffect, useState } from 'react';
import JuegoMemoria from '../../components/JuegoMemoria';
import JuegoRompecabezas from '../../components/JuegoRompecabezas';
import JuegoColores from '../../components/JuegoColores';
import { EncuestaData } from '@/components/Encuesta';

// Define the UsuarioData type
interface UsuarioData {
  id: number;
  nombreCompleto: string;
  edad: string;
  genero: string;
  tutorNombre: string;
  tutorEmail: string;
  tutorTelefono: string;
  diagnosticoTDAH: string;
  encuesta: EncuestaData | null;
  tiempoJuego: number | null;
}

export default function JuegoPage() {
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<string | null>(null);
  const [fondoDegradado, setFondoDegradado] = useState<string>('');
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [usuarios, setUsuarios] = useState<UsuarioData[]>([]); // Estado para los usuarios

  useEffect(() => {
    // Obtener los usuarios del localStorage
    const existingData = localStorage.getItem('usuarios');
    const usuarios = existingData ? JSON.parse(existingData) : [];
    setUsuarios(usuarios); // Guardar los usuarios en el estado

    // Lógica para seleccionar el juego y los colores
    if (usuarios.length > 0) {
      const ultimoUsuario = usuarios[usuarios.length - 1];

      if (ultimoUsuario && ultimoUsuario.encuesta) {
        const juegosSeleccionados = ultimoUsuario.encuesta.juegos;
        const preferenciaColores = ultimoUsuario.encuesta.colores;
        
        // Establecer el fondo según la preferencia de colores
        switch (preferenciaColores) {
          case 'brillantes':
            setFondoDegradado('linear-gradient(45deg, #FF5733, #FFC300, #DAF7A6)');
            break;
          case 'suaves':
            setFondoDegradado('linear-gradient(45deg, #B39DDB, #90CAF9, #A5D6A7)');
            break;
          default:
            setFondoDegradado('linear-gradient(45deg, #B39DDB, #90CAF9, #A5D6A7)');
            break;
        }

        // Seleccionar un juego
        if (juegosSeleccionados.includes('memoria')) {
          setJuegoSeleccionado('memoria');
        } else if (juegosSeleccionados.includes('rompecabezas')) {
          setJuegoSeleccionado('rompecabezas');
        } else if (juegosSeleccionados.includes('dibujos')) {
          setJuegoSeleccionado('colores');
        } else {
          setJuegoSeleccionado('memoria'); // Juego por defecto
        }
      }
    } else {
      // Si no hay usuarios, juego por defecto
      setJuegoSeleccionado('memoria');
    }
  }, []);

  const obtenerJuegoAlAzar = () => {
    const juegos = ['memoria', 'rompecabezas', 'colores'];
    return juegos[Math.floor(Math.random() * juegos.length)];
  };

  const duplicarUsuarioYJugarOtro = () => {
    const existingData = localStorage.getItem('usuarios');
    if (existingData) {
      const usuarios = JSON.parse(existingData);
      const ultimoUsuario = usuarios[usuarios.length - 1];

      // Crear un nuevo usuario duplicando el último, pero sin tiempo de juego
      const nuevoUsuario = { ...ultimoUsuario, id: usuarios.length + 1, tiempoJuego: null };

      // Guardar el nuevo usuario en localStorage y actualizar el estado
      const nuevosUsuarios = [...usuarios, nuevoUsuario];
      localStorage.setItem('usuarios', JSON.stringify(nuevosUsuarios));
      setUsuarios(nuevosUsuarios); // Actualizar estado

      // Cambiar al próximo juego de forma aleatoria
      const proximoJuego = obtenerJuegoAlAzar();
      setJuegoSeleccionado(proximoJuego); // Cambia el juego seleccionado
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: fondoDegradado,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Renderiza el juego basado en la selección */}
      {juegoSeleccionado === 'memoria' && <JuegoMemoria duplicarUsuarioYJugarOtro={duplicarUsuarioYJugarOtro}/>}
      {juegoSeleccionado === 'rompecabezas' && <JuegoRompecabezas duplicarUsuarioYJugarOtro={duplicarUsuarioYJugarOtro}/>}
      {juegoSeleccionado === 'colores' && <JuegoColores duplicarUsuarioYJugarOtro={duplicarUsuarioYJugarOtro}/>}

      {/* Botón para jugar otro juego */}
      {/* <button onClick={duplicarUsuarioYJugarOtro} style={{ position: 'absolute', bottom: 20 }}>
        Jugar otro juego
      </button> */}
    </div>
  );
}
