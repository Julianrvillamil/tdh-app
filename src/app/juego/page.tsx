'use client';
import { useEffect, useState } from 'react';
import JuegoMemoria from '../../components/JuegoMemoria';
import JuegoRompecabezas from '../../components/JuegoRompecabezas';
import JuegoColores from '../../components/JuegoColores';

export default function JuegoPage() {
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<string | null>(null);

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
    <div>
      {/* Renderizar el juego basado en la selección */}
      {juegoSeleccionado === 'memoria' && <JuegoMemoria />}
      {juegoSeleccionado === 'rompecabezas' && <JuegoRompecabezas />}
      {juegoSeleccionado === 'colores' && <JuegoColores />}
    </div>
  );
}
