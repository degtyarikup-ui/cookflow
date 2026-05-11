import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';

import { useAppContext } from '../context/AppContext';

export const AuthOverlay = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const { skipAuth } = useAppContext();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // Auto create profile
        if (data?.user) {
          await supabase.from('profiles').insert([{ id: data.user.id, email }]);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: 'fixed', inset: 0, zIndex: 9999, bgcolor: 'background.default', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 4, border: '1px solid', borderColor: 'grey.200', textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>CookFlow</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {isLogin ? 'Войдите, чтобы продолжить' : 'Создайте аккаунт для начала'}
        </Typography>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Пароль"
            type="password"
            variant="outlined"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
          />

          {error && <Typography color="error" variant="caption">{error}</Typography>}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 2, borderRadius: 8, textTransform: 'none', fontWeight: 'bold' }}
          >
            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </Button>
        </form>

        <Button
          variant="text"
          onClick={() => setIsLogin(!isLogin)}
          sx={{ mt: 2, textTransform: 'none' }}
        >
          {isLogin ? 'Нет аккаунта? Создать' : 'Уже есть аккаунт? Войти'}
        </Button>
        <Button
          variant="text"
          onClick={skipAuth}
          color="inherit"
          sx={{ mt: 1, textTransform: 'none', opacity: 0.6 }}
        >
          Продолжить без регистрации (Локально)
        </Button>
      </Paper>
    </Box>
  );
};