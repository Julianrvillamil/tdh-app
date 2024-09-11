'use client';

import { useRouter } from 'next/navigation';
import Encuesta from '../../components/Encuesta';

export default function EncuestaPage() {
  const router = useRouter();

  const handleSubmit = (data: any) => {
    localStorage.setItem('encuestaData', JSON.stringify(data)); // Guardar los datos en el localStorage
    router.push('/juego'); // Redirigir a la página del juego
  };

  return (
    <div>
      <Encuesta onSubmit={handleSubmit} />
    </div>
  );
}
