import { useState } from 'react';
import { Box, Button, TextField, RadioGroup, FormControlLabel, Radio, FormLabel, Typography } from '@mui/material';

interface FormData {
  nombreCompleto: string;
  edad: string;
  genero: string;
  tutorNombre: string;
  tutorEmail: string;
  tutorTelefono: string;
  diagnosticoTDAH: string;
}

interface FormularioRegistroProps {
  onSubmit: (data: FormData) => void;
}

export default function FormularioRegistro({ onSubmit }: Readonly<FormularioRegistroProps>) {
  const [formData, setFormData] = useState<FormData>({
    nombreCompleto: '',
    edad: '',
    genero: '',
    tutorNombre: '',
    tutorEmail: '',
    tutorTelefono: '',
    diagnosticoTDAH: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: '600px',
        mx: 'auto',
        mt: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: 'white'
      }}
    >
      <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mb: 3 }}>
        Registro
      </Typography>

      <TextField
        label="Nombre Completo"
        name="nombreCompleto"
        value={formData.nombreCompleto}
        onChange={handleChange}
        required
        fullWidth
      />
      
      <TextField
        label="Edad"
        type="number"
        name="edad"
        value={formData.edad}
        onChange={handleChange}
        required
        fullWidth
      />

      <FormLabel component="legend">Género</FormLabel>
      <RadioGroup row name="genero" value={formData.genero} onChange={handleChange}>
        <FormControlLabel value="nino" control={<Radio />} label="Niño" />
        <FormControlLabel value="nina" control={<Radio />} label="Niña" />
        <FormControlLabel value="prefieroNoDecir" control={<Radio />} label="Prefiero no decir" />
      </RadioGroup>

      <TextField
        label="Nombre del Tutor"
        name="tutorNombre"
        value={formData.tutorNombre}
        onChange={handleChange}
        required
        fullWidth
      />
      
      <TextField
        label="Email del Tutor"
        type="email"
        name="tutorEmail"
        value={formData.tutorEmail}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        label="Teléfono del Tutor"
        type="tel"
        name="tutorTelefono"
        value={formData.tutorTelefono}
        onChange={handleChange}
        required
        fullWidth
      />

      <FormLabel component="legend">Diagnóstico de TDAH</FormLabel>
      <RadioGroup row name="diagnosticoTDAH" value={formData.diagnosticoTDAH} onChange={handleChange}>
        <FormControlLabel value="inatento" control={<Radio />} label="Tipo predominante inatento" />
        <FormControlLabel value="hiperactivo" control={<Radio />} label="Tipo predominante hiperactivo-impulsivo" />
        <FormControlLabel value="combinado" control={<Radio />} label="Tipo combinado" />
        <FormControlLabel value="noDiagnostico" control={<Radio />} label="No tengo diagnóstico oficial" />
      </RadioGroup>

      <Button
        variant="contained"
        type="submit"
        fullWidth
        sx={{ backgroundColor: '#1976d2', py: 1.5 }}
      >
        ENVIAR
      </Button>
    </Box>
  );
}
