import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useTimer } from '../hooks/useTimer';
import { EncuestaData } from '../components/Encuesta';
import { useRouter } from 'next/navigation';

import Explosion from "react-canvas-confetti/dist/presets/fireworks";


const coloresDisponibles = ['🔴', '🟢', '🔵', '🟡'];

const generarPatronColores = (longitud: number): string[] => {
  return Array.from({ length: longitud }, () => coloresDisponibles[Math.floor(Math.random() * coloresDisponibles.length)]);
};

interface Usuario {
  id: number;
  nombreCompleto: string;
  edad: string;
  genero: string;
  tutorNombre: string;
  tutorEmail: string;
  tutorTelefono: string;
  diagnosticoTDAH: string;
  encuesta: EncuestaData | null;
  tiempoJuego?: number;
}

export default function JuegoColores() {
  const [coloresSeleccionados, setColoresSeleccionados] = useState<string[]>([]);
  const [patronColores] = useState<string[]>(generarPatronColores(4)); // Generar patrón de 4 colores
  const [indiceActual, setIndiceActual] = useState(0);
  const [error, setError] = useState(false);
  const [completado, setCompletado] = useState(false);

  const { tiempo, detenerTiempo } = useTimer();
  const router = useRouter(); 

  const manejarClick = (color: string) => {
    if (color === patronColores[indiceActual]) {
      setColoresSeleccionados([...coloresSeleccionados, color]);
      setIndiceActual(indiceActual + 1);
    } else {
      setError(true);
      setTimeout(() => {
        setColoresSeleccionados([]);
        setIndiceActual(0);
        setError(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (indiceActual === patronColores.length) {
      setCompletado(true);
      detenerTiempo();
    }
  }, [indiceActual, detenerTiempo, patronColores]);

  const manejarTerminar = () => {
    detenerTiempo();
    // Obtener los usuarios del localStorage
    const existingData = localStorage.getItem('usuarios');
    const usuarios: Usuario[] = existingData ? JSON.parse(existingData) : [];

    // Obtener el último usuario registrado (el que está jugando)
    const ultimoUsuario = usuarios[usuarios.length - 1];

    // Actualizar el tiempo de juego del usuario
    const updatedUsuarios = usuarios.map((usuario) => {
      if (usuario.id === ultimoUsuario.id) {
        return { ...usuario, tiempoJuego: tiempo }; // Guardar el tiempo de juego
      }
      return usuario;
    });

    // Guardar los datos actualizados en el localStorage
    localStorage.setItem('usuarios', JSON.stringify(updatedUsuarios));

    alert(`Juego terminado. Tiempo jugado: ${tiempo} segundos`);
  };

  const manejarVolverRegistro = () => {
    router.push('/'); 
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h4" mb={3}>
        Juego de Colores: Sigue el patrón
      </Typography>

      <Typography textAlign="center" mb={2}>
        Tiempo: {tiempo} segundos
      </Typography>

      <Typography variant="h6" mb={3}>
        Patron de Colores: {patronColores.join(' ')}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        {coloresDisponibles.map(color => (
          <Button
            key={color}
            variant="contained"
            color={error ? 'error' : 'primary'}
            onClick={() => manejarClick(color)}
            sx={{ width: 100, height: 100 }}
          >
            {color}
          </Button>
        ))}
      </Box>

      <Typography mt={3} variant="h6">
        Colores seleccionados: {coloresSeleccionados.join(' ')}
      </Typography>

      <Button variant="contained" color="primary" onClick={manejarTerminar} sx={{ mt: 3 }}>
        Terminar Juego
      </Button>

      {completado && (
        <>
          <Typography variant="h6" mt={3} color="success.main">
            ¡Has completado el patrón de colores!
          </Typography>
          <Button variant="outlined" color="secondary" onClick={manejarVolverRegistro} sx={{ mt: 2 }}>
          Volver al Registro
          </Button>
          <Explosion autorun={{ speed: 1 }}/>
        </>
      )}
    </Box>
  );
}
