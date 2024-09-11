'use client';

import { useRouter } from 'next/navigation';
import Encuesta from '../../components/Encuesta';

// Usa la interfaz correcta en lugar de "any"
import { EncuestaData } from '../../components/Encuesta'; // Asegúrate de que la interfaz esté exportada

export default function EncuestaPage() {
  const router = useRouter();

  const handleSubmit = (data: EncuestaData) => {
    localStorage.setItem('encuestaData', JSON.stringify(data)); // Guardar los datos en el localStorage
    router.push('/juego'); // Redirigir a la página del juego
  };

  return (
    <div>
      <Encuesta onSubmit={handleSubmit} />
    </div>
  );
}
