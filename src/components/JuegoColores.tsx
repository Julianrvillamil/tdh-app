import { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import { useTimer } from '../hooks/useTimer';
import { EncuestaData } from '../components/Encuesta';
import { useRouter } from 'next/navigation';
import Explosion from "react-canvas-confetti/dist/presets/fireworks";

const coloresDisponibles = ['🔴', '🟢', '🟡', '🟣', '⚫'];

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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function JuegoColores() {
  const [coloresSeleccionados, setColoresSeleccionados] = useState<string[]>([]);
  const [patronColores] = useState<string[]>(generarPatronColores(5));
  const [indiceActual, setIndiceActual] = useState(0);
  const [error, setError] = useState(false);
  const [completado, setCompletado] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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
    if (indiceActual === patronColores.length && !completado) {
      setCompletado(true);
      detenerTiempo();
      manejarTerminar();
    }
  }, [indiceActual, detenerTiempo]);

  const manejarTerminar = () => {
    detenerTiempo();
    const existingData = localStorage.getItem('usuarios');
    const usuarios: Usuario[] = existingData ? JSON.parse(existingData) : [];

    const ultimoUsuario = usuarios[usuarios.length - 1];

    const updatedUsuarios = usuarios.map((usuario) => {
      if (usuario.id === ultimoUsuario.id) {
        return { ...usuario, tiempoJuego: tiempo };
      }
      return usuario;
    });

    localStorage.setItem('usuarios', JSON.stringify(updatedUsuarios));

    setOpenModal(true);
    setShowConfetti(true);
  };

  const manejarVolverRegistro = () => {
    router.push('/');
  };

  const handleClose = () => setOpenModal(false);

  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h4" mb={3}>
        Juego de Colores: Sigue el patrón
      </Typography>

      <Typography textAlign="center" mb={2}>
        Tiempo: {tiempo} segundos
      </Typography>

      <Typography variant="h6" mb={3}>
        Patrón de Colores: {patronColores.join(' ')}
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

      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Tiempo Jugado: {tiempo} segundos
          </Typography>
          <Button variant="outlined" color="secondary" onClick={manejarVolverRegistro} sx={{ mt: 2 }}>
            Volver al Registro
          </Button>
        </Box>
      </Modal>

      {showConfetti && <Explosion autorun={{ speed: 1, duration: 2000 }} />}

      {completado && (
        <>
          <Typography variant="h6" mt={3} color="success.main">
            ¡Has completado el patrón de colores!
          </Typography>
          <Button variant="outlined" color="secondary" onClick={manejarVolverRegistro} sx={{ mt: 2 }}>
          Volver al Registro
          </Button>
        </>
      )}
    </Box>
  );
}
