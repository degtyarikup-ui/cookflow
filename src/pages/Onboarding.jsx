import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAppContext } from '../context/AppContext';
import { Box, Typography, Button, Paper, Checkbox, FormControlLabel, FormGroup } from '@mui/material';

const DIET_OPTIONS = ["Вегетарианец", "Без глютена", "Высокий белок", "Кето", "Низкокалорийное"];

export const Onboarding = () => {
  const { user, profile, fetchProfile } = useAppContext();
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  // If user already has preferences set (or skipped), we shouldn't show this, handled in App.jsx

  const handleToggle = (option) => {
    setSelected(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await supabase
        .from('profiles')
        .update({ dietary_preferences: selected })
        .eq('id', user.id);

      await fetchProfile(); // refresh profile state in context
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: 'fixed', inset: 0, zIndex: 9990, bgcolor: 'background.default', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">Ваши предпочтения</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }} textAlign="center">
          Помогите нашему ИИ подбирать для вас идеальное меню.
        </Typography>

        <FormGroup sx={{ gap: 1, mb: 4 }}>
          {DIET_OPTIONS.map(opt => (
            <FormControlLabel
              key={opt}
              control={<Checkbox checked={selected.includes(opt)} onChange={() => handleToggle(opt)} />}
              label={opt}
            />
          ))}
        </FormGroup>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSave}
          disabled={loading}
          sx={{ borderRadius: 8, textTransform: 'none', fontWeight: 'bold' }}
        >
          {loading ? 'Сохранение...' : 'Продолжить'}
        </Button>
      </Paper>
    </Box>
  );
};