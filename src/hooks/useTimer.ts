import { useState, useEffect } from 'react';

// Hook para manejar el temporizador
export const useTimer = () => {
  const [tiempo, setTiempo] = useState(0);
  const [intervalo, setIntervalo] = useState<NodeJS.Timeout | null>(null);

  // Iniciar el temporizador cuando el juego comience
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempo(t => t + 1);
    }, 1000);
    setIntervalo(interval);
    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
  }, []);

  const detenerTiempo = () => {
    if (intervalo) clearInterval(intervalo); // Detener el intervalo
  };

  return { tiempo, detenerTiempo };
};
