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
    localStorage.setItem('formData', JSON.stringify(data)); // Guardar los datos en el localStorage
    router.push('/encuesta'); // Redirigir a la página de la encuesta
  };

  return (
    <div>
      <FormularioRegistro onSubmit={handleSubmit} />
    </div>
  );
}
