import { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import { useTimer } from '../hooks/useTimer';
import { useRouter } from 'next/navigation';
import Explosion from "react-canvas-confetti/dist/presets/realistic";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';

interface JuegoProps {
  duplicarUsuarioYJugarOtro: () => void;
} 

interface Pieza {
  id: number;
  fila: number;
  columna: number;
  colocada: boolean;
  image: string;
}

interface PuzzlePieceProps {
  pieza: Pieza;
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

// Función para generar las piezas de la imagen
const generarPiezas = (): Pieza[] => {
  const piezas: Pieza[] = [];
  for (let fila = 1; fila <= 3; fila++) {
    for (let columna = 1; columna <= 3; columna++) {
      piezas.push({
        id: fila * 3 + columna,
        fila,
        columna,
        colocada: false,
        image: `/fila-${fila}-columna-${columna}.jpg`, // Ajusta la ruta según la estructura de tu proyecto
      });
    }
  }
  return piezas.sort(() => Math.random() - 0.5); // Mantén las piezas desordenadas
};

// Componente de una pieza del rompecabezas
function PuzzlePiece({ pieza }: PuzzlePieceProps) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'PIEZA',
    item: { id: pieza.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  drag(ref);

  return (
    <img
      ref={ref}
      src={pieza.image}
      alt={`Pieza ${pieza.id}`}
      style={{
        width: 100,
        height: 100,
        opacity: isDragging ? 0.5 : 1,
        border: pieza.colocada ? '2px solid green' : '1px solid black',
      }}
    />
  );
}
interface PuzzleCellProps {
  id: string;
  fila: number;
  columna: number;
  piezaCorrecta: Pieza | null;
  onDrop: (id: number, fila: number, columna: number) => void;
}
// Componente del lugar donde caerá la pieza
function PuzzleCell({  fila, columna, piezaCorrecta, onDrop }: PuzzleCellProps) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [{ isOver }, drop] = useDrop({
    accept: 'PIEZA',
    drop: (item: { id: number }) => onDrop(item.id, fila, columna),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drop(ref);

  return (
    <div
      ref={ref}
      style={{
        width: 100,
        height: 100,
        border: '1px solid black',
        backgroundColor: isOver ? 'lightgreen' : 'white',
      }}
    >
      {piezaCorrecta && <img src={piezaCorrecta.image} alt="pieza" style={{ width: '100%', height: '100%' }} />}
    </div>
  );
}

export default function JuegoRompecabezas({ duplicarUsuarioYJugarOtro }: JuegoProps) {
  const [piezas, setPiezas] = useState<Pieza[]>(generarPiezas());
  const [completado] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { tiempo, detenerTiempo } = useTimer();
  const router = useRouter();

  const manejarTerminar = () => {
    detenerTiempo();

    // Obtener los usuarios del localStorage
    const existingData = localStorage.getItem('usuarios');
    const usuarios = existingData ? JSON.parse(existingData) : [];

    // Obtener el último usuario registrado
    const ultimoUsuario = usuarios[usuarios.length - 1];

    // Actualizar el tiempo de juego
    interface Usuario {
      id: number;
      tiempoJuego?: number;
    }

    const updatedUsuarios: Usuario[] = usuarios.map((usuario: Usuario): Usuario => {
      if (usuario.id === ultimoUsuario.id) {
        return { ...usuario, tiempoJuego: tiempo }; // Guardar el tiempo jugado
      }
      return usuario;
    });

    // Guardar los datos actualizados en el localStorage
    localStorage.setItem('usuarios', JSON.stringify(updatedUsuarios));

    setOpenModal(true);
    setShowConfetti(true);
  };

  const manejarVolverRegistro = () => {
    router.push('/');
  };

  const handleDrop = (piezaId: number, filaCelda: number, columnaCelda: number) => {
    // Encuentra la pieza que estás arrastrando
    const pieza = piezas.find((p) => p.id === piezaId);
    
    // Imprime en consola la información de la pieza que estás arrastrando
    console.log("Pieza arrastrada:", pieza);
  
    // Imprime en consola la información de la celda a la que intentas soltar
    console.log("Intentando soltar en celda:", { filaCelda, columnaCelda });
  
    if (pieza && !pieza.colocada) {
      // Compara la fila y columna de la pieza con la de la celda
      if (pieza.fila === filaCelda && pieza.columna === columnaCelda) {
        console.log("Pieza colocada correctamente");
        setPiezas((prevPiezas) =>
          prevPiezas.map((p) =>
            p.id === piezaId ? { ...p, colocada: true } : p
          )
        );
      } else {
        console.log("Pieza incorrecta para esta celda");
      }
    }
  
    // Verifica si todas las piezas están en su lugar correcto
    if (piezas.every((p) => p.colocada)) {
      manejarTerminar();
    }
  };

  // Verificar si todas las piezas están en su lugar correcto
  useEffect(() => {
    if (piezas.every((p) => p.colocada)) {
      manejarTerminar();
    }
  }, [piezas]); // El efecto se ejecuta cuando las piezas cambian


  // Tablero fijo de 3x3
  const filas = [1, 2, 3];
  const columnas = [1, 2, 3];
  

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h4" mb={3}>
          Rompecabezas: Arrastra y coloca las piezas
        </Typography>
        <Typography textAlign="center" mb={2}>
          Tiempo: {tiempo} segundos
        </Typography>
        {/* Tablero fijo con orden correcto de filas y columnas */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: 2, justifyContent: 'center', margin: '0 auto' }}>
          {filas.map((fila) => 
            columnas.map((columna) => (
              <PuzzleCell
                key={`celda-${fila}-${columna}`}
                id={`celda-${fila}-${columna}`}
                fila={fila}
                columna={columna}
                piezaCorrecta={piezas.find((pieza) => pieza.fila === fila && pieza.columna === columna && pieza.colocada) || null}
                onDrop={handleDrop}
              />
            ))
          )}
        </Box>
        {/* Piezas desordenadas */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: 2, mt: 3, justifyContent: 'center' }}>
          {piezas.map((pieza) =>
            !pieza.colocada ? <PuzzlePiece key={pieza.id} pieza={pieza} /> : null
          )}
        </Box>
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
            <Button onClick={duplicarUsuarioYJugarOtro} sx={{ mt: 2 }} variant="contained" color="success">
              Jugar otro juego
            </Button>
          </>
        )}
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
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
            <Button onClick={duplicarUsuarioYJugarOtro} sx={{ ml: 2, mt: 2 }} variant="contained" color="success">
              Jugar otro juego
            </Button>
          </Box>
        </Modal>

        {showConfetti && (
          <Explosion autorun={{ speed: 1, duration: 2000 }} />
        )}
      </Box>
    </DndProvider>
  );
}
