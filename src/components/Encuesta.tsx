import { useState } from 'react';
import { Box, Typography, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, RadioGroup, Radio, Button } from '@mui/material';

export interface EncuestaData {
  juegos: string[];
  recompensa: string;
  crearJuegos: string;
  colores: string;
  concentracion: string[];
  mejorarTiempo: string;
  sonidos: string;
  recibirAyuda: string;
}

export default function Encuesta({ onSubmit }: { onSubmit: (data: EncuestaData) => void }) {
  const [encuestaData, setEncuestaData] = useState<EncuestaData>({
    juegos: [],
    recompensa: '',
    crearJuegos: '',
    colores: '',
    concentracion: [],
    mejorarTiempo: '',
    sonidos: '',
    recibirAyuda: '',
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
  
    setEncuestaData(prev => {
      const prevValue = prev[name as keyof EncuestaData];
  
      // Asegurarse de que estamos trabajando con un array
      if (Array.isArray(prevValue)) {
        const selectedItems = checked
          ? [...prevValue, value] // Agregar el nuevo valor si está marcado
          : prevValue.filter(item => item !== value); // Remover si no está marcado
  
        return { ...prev, [name]: selectedItems };
      }
  
      return prev;
    });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEncuestaData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(encuestaData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: '600px', mx: 'auto', mt: 5, display: 'flex', flexDirection: 'column', gap: 3, p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: 'white' }}>
      <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mb: 3 }}>Encuesta</Typography>

      {/* Sección 1: Juegos */}
      <FormControl component="fieldset">
        <FormLabel component="legend">1. ¿Qué tipo de juegos te gustan más?</FormLabel>
        <FormGroup>
          <FormControlLabel control={<Checkbox name="juegos" value="memoria" onChange={handleCheckboxChange} />} label="Juegos de memoria" />
          <FormControlLabel control={<Checkbox name="juegos" value="rompecabezas" onChange={handleCheckboxChange} />} label="Juegos de rompecabezas" />
          <FormControlLabel control={<Checkbox name="juegos" value="dibujos" onChange={handleCheckboxChange} />} label="Juegos con dibujos y colores" />
          <FormControlLabel control={<Checkbox name="juegos" value="fisico" onChange={handleCheckboxChange} />} label="Juegos que involucren movimiento físico" />
          <FormControlLabel control={<Checkbox name="juegos" value="aventura" onChange={handleCheckboxChange} />} label="Juegos de aventuras o historias interactivas" />
        </FormGroup>
      </FormControl>

      <FormControl component="fieldset">
        <FormLabel component="legend">2. ¿Qué tipo de recompensa te gusta en un juego?</FormLabel>
        <RadioGroup name="recompensa" value={encuestaData.recompensa} onChange={handleRadioChange}>
          <FormControlLabel value="visual" control={<Radio />} label="Premios visuales (estrellas, trofeos)" />
          <FormControlLabel value="sonido" control={<Radio />} label="Sonidos y música de felicitación" />
          <FormControlLabel value="animacion" control={<Radio />} label="Ver personajes divertidos o animaciones" />
          <FormControlLabel value="puntaje" control={<Radio />} label="Recibir puntajes altos o medallas" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset">
        <FormLabel component="legend">3. ¿Te gustan los juegos donde puedas crear algo?</FormLabel>
        <RadioGroup name="crearJuegos" value={encuestaData.crearJuegos} onChange={handleRadioChange}>
          <FormControlLabel value="si" control={<Radio />} label="Sí" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      {/* Sección 2: Colores y Estilo Visual */}
      <FormControl component="fieldset">
        <FormLabel component="legend">4. ¿Prefieres los colores brillantes o los colores suaves?</FormLabel>
        <RadioGroup name="colores" value={encuestaData.colores} onChange={handleRadioChange}>
          <FormControlLabel value="brillantes" control={<Radio />} label="Colores brillantes" />
          <FormControlLabel value="suaves" control={<Radio />} label="Colores suaves" />
          <FormControlLabel value="noprefiero" control={<Radio />} label="No tengo preferencia" />
        </RadioGroup>
      </FormControl>

      {/* Sección 3: Actividades que Ayudan a Concentrarte */}
      <FormControl component="fieldset">
        <FormLabel component="legend">5. ¿Qué actividades te ayudan a concentrarte más?</FormLabel>
        <FormGroup>
          <FormControlLabel control={<Checkbox name="concentracion" value="musica" onChange={handleCheckboxChange} />} label="Escuchar música suave" />
          <FormControlLabel control={<Checkbox name="concentracion" value="imagenes" onChange={handleCheckboxChange} />} label="Ver imágenes coloridas o animaciones" />
          <FormControlLabel control={<Checkbox name="concentracion" value="juegosRapidos" onChange={handleCheckboxChange} />} label="Juegos rápidos donde tengo que reaccionar" />
        </FormGroup>
      </FormControl>

      <FormControl component="fieldset">
        <FormLabel component="legend">6. ¿Te gustan los juegos donde puedas mejorar tu tiempo?</FormLabel>
        <RadioGroup name="mejorarTiempo" value={encuestaData.mejorarTiempo} onChange={handleRadioChange}>
          <FormControlLabel value="si" control={<Radio />} label="Sí, me gusta mejorar mi tiempo" />
          <FormControlLabel value="no" control={<Radio />} label="No, prefiero pasar a otro nivel cuando termino" />
        </RadioGroup>
      </FormControl>

      {/* Sección 4: Preferencias de Interacción */}
      <FormControl component="fieldset">
        <FormLabel component="legend">7. ¿Qué tipo de sonidos te gustan más en los juegos?</FormLabel>
        <RadioGroup name="sonidos" value={encuestaData.sonidos} onChange={handleRadioChange}>
          <FormControlLabel value="divertidos" control={<Radio />} label="Sonidos divertidos y rápidos" />
          <FormControlLabel value="suaves" control={<Radio />} label="Sonidos suaves y calmantes" />
          <FormControlLabel value="sinSonido" control={<Radio />} label="Prefiero jugar sin sonidos" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset">
        <FormLabel component="legend">8. ¿Te gustaría recibir ayuda o consejos mientras juegas?</FormLabel>
        <RadioGroup name="recibirAyuda" value={encuestaData.recibirAyuda} onChange={handleRadioChange}>
          <FormControlLabel value="si" control={<Radio />} label="Sí, me gusta que me ayuden mientras juego" />
          <FormControlLabel value="no" control={<Radio />} label="No, prefiero intentarlo solo" />
        </RadioGroup>
      </FormControl>

      <Button variant="contained" type="submit" fullWidth sx={{ backgroundColor: '#1976d2', py: 1.5 }}>
        ENVIAR
      </Button>
    </Box>
  );
}
