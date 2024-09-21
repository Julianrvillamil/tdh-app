'use client';

import { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';

interface EncuestaData {
  juegos: string[];
  recompensa: string;
  crearJuegos: string;
  colores: string;
  concentracion: string[];
  mejorarTiempo: string;
  sonidos: string;
  recibirAyuda: string;
}

interface UsuarioData {
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

export default function DatosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioData[]>([]);

  // Obtener los datos de localStorage cuando se monta el componente
  useEffect(() => {
    const storedData = localStorage.getItem('usuarios');
    if (storedData) {
      setUsuarios(JSON.parse(storedData));
    }
  }, []);

  if (!usuarios.length) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h5">No hay datos disponibles.</Typography>
      </Box>
    );
  }

  // Función para borrar los datos del localStorage
  const borrarDatos = () => {
    localStorage.removeItem('usuarios');  // Borra la clave 'usuarios' del localStorage
    setUsuarios([]);  // Limpia el estado local para vaciar la tabla
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', mt: 5 }}>
      <Typography variant="h4" textAlign="center" mb={3}>
        Datos de Usuarios Registrados y Encuestas
      </Typography>

       {/* Botón para borrar los datos */}
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={borrarDatos} 
        sx={{ mb: 3 }}
      >
        Borrar Todos los Datos
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre Completo</TableCell>
              <TableCell>Edad</TableCell>
              <TableCell>Género</TableCell>
              <TableCell>Tutor Nombre</TableCell>
              <TableCell>Tutor Email</TableCell>
              <TableCell>Teléfono del Tutor</TableCell>
              <TableCell>Diagnóstico TDAH</TableCell>
              <TableCell>Encuesta Completada</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>{usuario.nombreCompleto}</TableCell>
                <TableCell>{usuario.edad}</TableCell>
                <TableCell>{usuario.genero}</TableCell>
                <TableCell>{usuario.tutorNombre}</TableCell>
                <TableCell>{usuario.tutorEmail}</TableCell>
                <TableCell>{usuario.tutorTelefono}</TableCell>
                <TableCell>{usuario.diagnosticoTDAH}</TableCell>
                <TableCell>{usuario.encuesta ? 'Sí' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
