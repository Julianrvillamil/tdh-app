'use client'
import { useRouter } from 'next/navigation'; // Cambia el import aquí
import FormularioRegistro from '../components/FormularioRegistro';

interface FormData {
    nombreCompleto: string;
    edad: string; // Change the type of 'edad' to string
    genero: string;
    tutorNombre: string;
    tutorEmail: string;
    tutorTelefono: string;
    diagnosticoTDAH: string;
  }

export default function RegisterPage() {
  const router = useRouter(); // Ahora puedes usar useRouter sin problemas

  const handleSubmit = (data: FormData) => {
    // Obtener los datos existentes en localStorage
    const existingData = localStorage.getItem('usuarios');
    const usuarios = existingData ? JSON.parse(existingData) : [];
  
    // Crear un nuevo objeto de usuario con los datos del registro
    const nuevoUsuario = {
      id: Date.now(), // Usar una marca de tiempo como ID único
      ...data,        // Datos del formulario de registro
      encuesta: null, // Aún no se ha hecho la encuesta
    };
  
    // Agregar el nuevo usuario al array
    usuarios.push(nuevoUsuario);
  
    // Guardar en localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  
    // Redirigir a la página de la encuesta
    router.push(`/encuesta?id=${nuevoUsuario.id}`); // Pasar el ID del usuario
  };

  return (
    <div>
      <FormularioRegistro onSubmit={handleSubmit} />
    </div>
  );
}
