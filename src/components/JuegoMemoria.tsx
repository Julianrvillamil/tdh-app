import { useState, useEffect } from 'react';
import { Box, Button, Grid, Modal, Typography } from '@mui/material';
import { useRouter } from 'next/navigation'; // Importar useRouter para redirigir
import { useTimer } from '../hooks/useTimer'; // Custom hook para manejar el tiempo
import { EncuestaData } from '../components/Encuesta';
import Explosion from "react-canvas-confetti/dist/presets/fireworks";


interface JuegoProps {
  duplicarUsuarioYJugarOtro: () => void;
} 
interface Carta {
  id: number;
  contenido: string;
  visible: boolean;
  encontrada: boolean;
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

const generarCartas = (): Carta[] => {
  const contenidoCartas = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒'];
  const cartasDuplicadas = [...contenidoCartas, ...contenidoCartas];
  return cartasDuplicadas.sort(() => Math.random() - 0.5).map((contenido, index) => ({
    id: index,
    contenido,
    visible: false,
    encontrada: false,
  }));
};

export default function JuegoMemoria({ duplicarUsuarioYJugarOtro }: JuegoProps) {
  const [cartas, setCartas] = useState<Carta[]>(generarCartas());
  const [primerCarta, setPrimerCarta] = useState<Carta | null>(null);
  const [segundoCarta, setSegundoCarta] = useState<Carta | null>(null);
  const [bloquear, setBloquear] = useState(false);
  const { tiempo, detenerTiempo } = useTimer();
  const [completado, setCompletado] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  const manejarClick = (carta: Carta) => {
    if (bloquear || (primerCarta && segundoCarta)) return;

    setCartas(prevCartas => prevCartas.map(c => (c.id === carta.id ? { ...c, visible: true } : c)));

    if (!primerCarta) {
      setPrimerCarta(carta);
    } else {
      setSegundoCarta(carta);
      setBloquear(true);
      setTimeout(() => {
        if (primerCarta.contenido === carta.contenido) {
          setCartas(prevCartas => prevCartas.map(c =>
            c.contenido === carta.contenido ? { ...c, encontrada: true } : c
          ));
        } else {
          setCartas(prevCartas => prevCartas.map(c =>
            c.id === carta.id || c.id === primerCarta.id ? { ...c, visible: false } : c
          ));
        }
        setPrimerCarta(null);
        setSegundoCarta(null);
        setBloquear(false);
      }, 1000);
    }
  };

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
    setCompletado(true);
  };

  const manejarVolverRegistro = () => {
    router.push('/');
  };

  useEffect(() => {
    const todasEncontradas = cartas.every(c => c.encontrada);
    if (todasEncontradas && !completado) manejarTerminar();
  }, [cartas, completado]);

  const handleClose = () => setOpenModal(false);

  return (
    <Box sx={{ width: '100%', maxWidth: '600px', mx: 'auto', mt: 5 }}>
      <Typography variant="h4" textAlign="center" mb={3}>
        Juego de Memoria
      </Typography>
      <Typography textAlign="center" mb={2}>
        Tiempo: {tiempo} segundos
      </Typography>
      <Grid container spacing={2}>
        {cartas.map(carta => (
          <Grid item xs={4} key={carta.id} onClick={() => manejarClick(carta)}>
            <Box
              sx={{
                height: 100,
                backgroundColor: carta.visible || carta.encontrada ? '#fff' : '#1976d2',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                borderRadius: 1,
                color: carta.visible || carta.encontrada ? '#000' : '#1976d2',
              }}
            >
              {carta.visible || carta.encontrada ? carta.contenido : '❓'}
            </Box>
          </Grid>
        ))}
      </Grid>

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
          <Button onClick={duplicarUsuarioYJugarOtro} sx={{ mt: 2 }} variant="contained" color="success">
            Jugar otro juego
          </Button>
        </Box>
      </Modal>

      {showConfetti && <Explosion autorun={{ speed: 1, duration: 2000 }} />}

      {completado && (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mt: 3, 
            mb: 3 
          }}
        >
          <Typography variant="h6" color="success.main" mb={2}>
            ¡Has completado el juego de memoria!
          </Typography>
          <Button variant="outlined" color="secondary" onClick={manejarVolverRegistro} sx={{ mt: 2, mb: 3 }}>
            Volver al Registro
          </Button>
          <Button onClick={duplicarUsuarioYJugarOtro} sx={{ ml: 2, mt: 2 }} variant="contained" color="success">
            Jugar otro juego
          </Button>
        </Box>
      )}

    </Box>
  );
}