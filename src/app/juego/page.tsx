'use client';
import { useEffect, useState } from 'react';
import JuegoMemoria from '../../components/JuegoMemoria';
import JuegoRompecabezas from '../../components/JuegoRompecabezas';
import JuegoColores from '../../components/JuegoColores';

export default function JuegoPage() {
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<string | null>(null);
  const [fondoDegradado, setFondoDegradado] = useState<string>('');

  useEffect(() => {
    // Obtener los usuarios del localStorage
    const existingData = localStorage.getItem('usuarios');
    const usuarios = existingData ? JSON.parse(existingData) : [];

    // Verificar si hay usuarios registrados
    if (usuarios.length > 0) {
      const ultimoUsuario = usuarios[usuarios.length - 1];

      // Verificar si el último usuario y su encuesta existen
      if (ultimoUsuario && ultimoUsuario.encuesta) {
        const juegosSeleccionados = ultimoUsuario.encuesta.juegos;
        const preferenciaColores = ultimoUsuario.encuesta.colores; // Asegúrate que el nombre del campo sea el correcto
        console.log('preferenciaColores', preferenciaColores);
        
        // Cambiar el fondo de la página según la preferencia de colores
        switch (preferenciaColores) {
          case 'brillantes':
            setFondoDegradado('linear-gradient(45deg, #FF5733, #FFC300, #DAF7A6)');
            break;
          case 'suaves':
            setFondoDegradado('linear-gradient(45deg, #B39DDB, #90CAF9, #A5D6A7)');
            break;
          case 'No tengo preferencia':
          default:
            setFondoDegradado('linear-gradient(45deg, #B39DDB, #90CAF9, #A5D6A7)');
            break;
        }

        // Si se selecciona "Juego de Memoria" junto con otros juegos, priorizamos el de memoria
        if (juegosSeleccionados.includes('memoria')) {
          setJuegoSeleccionado('memoria');
        } else if (juegosSeleccionados.includes('rompecabezas')) {
          setJuegoSeleccionado('rompecabezas');
        } else if (juegosSeleccionados.includes('dibujos')) {
          setJuegoSeleccionado('colores');
        } else {
          setJuegoSeleccionado('memoria'); // Juego de memoria por defecto
        }
      } else {
        // Si no hay encuesta, mostrar juego de memoria por defecto
        setJuegoSeleccionado('memoria');
      }
    } else {
      // Si no hay usuarios, mostrar juego de memoria por defecto
      setJuegoSeleccionado('memoria');
    }
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',  // Asegurar que ocupe toda la pantalla
        background: fondoDegradado,  // Aplicar el degradado de fondo dinámico
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Renderizar el juego basado en la selección */}
      {juegoSeleccionado === 'memoria' && <JuegoMemoria />}
      {juegoSeleccionado === 'rompecabezas' && <JuegoRompecabezas />}
      {juegoSeleccionado === 'colores' && <JuegoColores />}
    </div>
  );
}
