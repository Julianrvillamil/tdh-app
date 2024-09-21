'use client';

import { useRouter } from 'next/navigation';
import Encuesta, { EncuestaData } from '../../components/Encuesta'; // Asegúrate de que la interfaz esté exportada


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
}

export default function EncuestaPage() {
  const router = useRouter();

  const handleSubmit = (data: EncuestaData) => {
    const userId = new URLSearchParams(window.location.search).get('id'); 
    const existingData = localStorage.getItem('usuarios');
    const usuarios = existingData ? JSON.parse(existingData) : [];
  
    // Buscar el usuario y actualizar sus datos con la encuesta
    const updatedUsuarios = usuarios.map((usuario: Usuario) => {
      if (usuario.id === parseInt(userId as string)) {
        return { ...usuario, encuesta: data };
      }
      return usuario;
    });
  
    // Guardar los datos actualizados en localStorage
    localStorage.setItem('usuarios', JSON.stringify(updatedUsuarios));
  
    // Redirigir al juego
    router.push('/juego');
  };
  

  return (
    <div>
      <Encuesta onSubmit={handleSubmit} />
    </div>
  );
}
