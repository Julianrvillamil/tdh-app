import { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import { useTimer } from '../hooks/useTimer';
import { useRouter } from 'next/navigation';
import { EncuestaData } from '../components/Encuesta';
import Explosion from "react-canvas-confetti/dist/presets/realistic";

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

const generarPiezas = (): Pieza[] => {
  const contenidoPiezas = ['🧩1', '🧩2', '🧩3', '🧩4', '🧩5', '🧩6'];
  return contenidoPiezas
    .sort(() => Math.random() - 0.5)
    .map((contenido, index) => ({
      id: index,
      colocada: false,
      contenido,
    }));
};

export default function JuegoRompecabezas() {
  const [piezas, setPiezas] = useState<Pieza[]>(generarPiezas());
  const [siguienteNumero, setSiguienteNumero] = useState(1);
  const [error, setError] = useState(false);
  const { tiempo, detenerTiempo } = useTimer();
  const router = useRouter();
  const [completado, setCompletado] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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
    setShowConfetti(true); // Disparar la explosión de confeti
  };

  const manejarVolverRegistro = () => {
    router.push('/');
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
        setPiezas(generarPiezas());
        setSiguienteNumero(1);
        setError(false);
      }, 1000);
    }
  };

  const handleClose = () => setOpenModal(false);

  useEffect(() => {
    if (siguienteNumero > 6 && !completado) { // Solo se ejecuta si no está marcado como completado
      manejarTerminar();
      setCompletado(true); // Marcar como completado para que no vuelva a ejecutar manejarTerminar
    }
  }, [siguienteNumero, completado]);

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
          <Button
            variant="outlined"
            color="secondary"
            onClick={manejarVolverRegistro}
            sx={{ mt: 2 }}
          >
            Volver al Registro
          </Button>
        </Box>
      </Modal>

      {showConfetti && (
        <Explosion
          autorun={{ speed: 1, duration: 2000 }}
          
        />
      )}

      {completado && (
        <>
          <Typography variant="h6" mt={3} color="success.main">
            ¡Has completado el Rompecabezas!
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={manejarVolverRegistro}
            sx={{ mt: 2 }}
          >
            Volver al Registro
          </Button>
        </>
      )}
    </Box>
  );
}
