import { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';

interface Carta {
  id: number;
  contenido: string;
  visible: boolean;
  encontrada: boolean;
}

const generarCartas = (): Carta[] => {
  const contenidoCartas = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒']; // Emoticonos de frutas
  const cartasDuplicadas = [...contenidoCartas, ...contenidoCartas]; // Duplicar las cartas para hacer pares
  const cartasBarajadas = cartasDuplicadas
    .sort(() => Math.random() - 0.5)
    .map((contenido, index) => ({
      id: index,
      contenido,
      visible: false,
      encontrada: false,
    }));

  return cartasBarajadas;
};

export default function JuegoMemoria() {
  const [cartas, setCartas] = useState<Carta[]>(generarCartas());
  const [primerCarta, setPrimerCarta] = useState<Carta | null>(null);
  const [segundoCarta, setSegundoCarta] = useState<Carta | null>(null);
  const [bloquear, setBloquear] = useState(false);
  const [tiempo, setTiempo] = useState(0);
  const [intervalo, setIntervalo] = useState<NodeJS.Timeout | null>(null);

  // Empezar el temporizador cuando comience el juego
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempo(t => t + 1);
    }, 1000);
    setIntervalo(interval);
    return () => clearInterval(interval); // Limpiar cuando el componente se desmonte
  }, []);

  const manejarClick = (carta: Carta) => {
    if (bloquear) return;

    if (primerCarta && segundoCarta) return;

    setCartas(prevCartas =>
      prevCartas.map(c =>
        c.id === carta.id ? { ...c, visible: true } : c
      )
    );

    if (!primerCarta) {
      setPrimerCarta(carta);
    } else if (!segundoCarta) {
      setSegundoCarta(carta);
      setBloquear(true);

      setTimeout(() => {
        if (primerCarta.contenido === carta.contenido) {
          setCartas(prevCartas =>
            prevCartas.map(c =>
              c.contenido === carta.contenido
                ? { ...c, encontrada: true }
                : c
            )
          );
        } else {
          setCartas(prevCartas =>
            prevCartas.map(c =>
              c.id === carta.id || c.id === primerCarta.id
                ? { ...c, visible: false }
                : c
            )
          );
        }

        setPrimerCarta(null);
        setSegundoCarta(null);
        setBloquear(false);
      }, 1000);
    }
  };

  const manejarTerminar = () => {
    if (intervalo) clearInterval(intervalo);
    alert(`Juego terminado. Tiempo jugado: ${tiempo} segundos`);
  };

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
          <Grid
            item
            xs={4}
            key={carta.id}
            onClick={() => manejarClick(carta)}
          >
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
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={manejarTerminar}
        sx={{ mt: 3 }}
      >
        Terminar Juego
      </Button>
    </Box>
  );
}
