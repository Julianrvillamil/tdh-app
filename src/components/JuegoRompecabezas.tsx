import { useState, useEffect  } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useTimer } from '../hooks/useTimer';
import { useRouter } from 'next/navigation'; // Importar useRouter para redirigir
import { EncuestaData } from '../components/Encuesta';

import Explosion from "react-canvas-confetti/dist/presets/fireworks";


interface Pieza {
  id: number;
  colocada: boolean;
  contenido: string;
}

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

const generarPiezas = (): Pieza[] => {
  const contenidoPiezas = ['🧩1', '🧩2', '🧩3', '🧩4', '🧩5', '🧩6'];
  const piezasBarajadas = contenidoPiezas
    .sort(() => Math.random() - 0.5) // Barajar el orden de las piezas
    .map((contenido, index) => ({
      id: index,
      colocada: false,
      contenido,
    }));
  return piezasBarajadas;
};

export default function JuegoRompecabezas() {
  const [piezas, setPiezas] = useState<Pieza[]>(generarPiezas());
  const [siguienteNumero, setSiguienteNumero] = useState(1); // Número que debe seleccionarse
  const [error, setError] = useState(false); // Para mostrar el error
  const { tiempo, detenerTiempo } = useTimer();
  const router = useRouter(); // Para redirigir al registro
  const [completado, setCompletado] = useState(false); // Controla si el juego se ha completado

  
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
    setCompletado(true); // Marcar como completado
  };

  const manejarVolverRegistro = () => {
    router.push('/'); // Redirigir al registro
  };

  const manejarClick = (pieza: Pieza) => {
    if (pieza.contenido === `🧩${siguienteNumero}`) {
      setPiezas(prevPiezas =>
        prevPiezas.map(p =>
          p.id === pieza.id ? { ...p, colocada: true } : p
        )
      );
      setSiguienteNumero(siguienteNumero + 1);
    } else {
      setError(true);
      setTimeout(() => {
        setPiezas(generarPiezas()); // Reiniciar el rompecabezas si el orden es incorrecto
        setSiguienteNumero(1); // Reiniciar el número
        setError(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (siguienteNumero > 6) {
      detenerTiempo();
      setCompletado(true); // Marcar como completado
    }
  }, [siguienteNumero, detenerTiempo]);

  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h4" mb={3}>
        Juego de Rompecabezas: Selecciona en orden
      </Typography>

      <Typography textAlign="center" mb={2}>
        Tiempo: {tiempo} segundos
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        {piezas.map(pieza => (
          <Button
            key={pieza.id}
            variant={pieza.colocada ? 'contained' : 'outlined'}
            color={error ? 'error' : 'primary'}
            onClick={() => manejarClick(pieza)}
            disabled={pieza.colocada}
            sx={{ width: 100, height: 100 }}
          >
            {pieza.contenido}
          </Button>
        ))}
      </Box>

      {error && (
        <Typography variant="h6" mt={3} color="error.main">
          ¡Orden de fichas erróneo!
        </Typography>
      )}

    {!completado && (
      <Button variant="contained" color="primary" onClick={manejarTerminar} sx={{ mt: 3 }}>
        Terminar Juego
      </Button>)}

      {completado && (
        <>
          <Typography variant="h6" mt={3} color="success.main">
            ¡Has completado el Rompecabezas!
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
