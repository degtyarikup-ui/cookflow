import { useAppContext } from '../context/AppContext';
import { supabase } from '../supabaseClient';
import { Box, Typography, Button, Avatar, Dialog, DialogContent, DialogTitle, IconButton, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import LogoutIcon from '@mui/icons-material/Logout';

export const ProfileOverlay = ({ open, onClose }) => {
  const { user, profile, isPremium, logout } = useAppContext();

  if (!user && !supabase.isMock) {
    return null;
  }

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4, position: 'absolute', top: 20, m: 2 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" fontWeight="bold">Профиль</Typography>
        <IconButton aria-label="Закрыть" onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
            <PersonIcon fontSize="large" />
          </Avatar>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {user?.email || "Гость (Локально)"}
            </Typography>
            {isPremium && (
              <Chip icon={<StarIcon sx={{ color: '#F59E0B !important' }} />} label="PRO Аккаунт" size="small" sx={{ mt: 1, bgcolor: 'warning.50', color: 'warning.main', fontWeight: 'bold' }} />
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 3 }}>
          <Typography variant="caption" color="text.secondary" fontWeight="bold" textTransform="uppercase">
            Предпочтения
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {profile?.dietary_preferences?.length > 0 ? (
               profile.dietary_preferences.map(pref => (
                 <Chip key={pref} label={pref} size="small" variant="outlined" />
               ))
            ) : (
              <Typography variant="body2" color="text.secondary">Не указаны</Typography>
            )}
          </Box>
        </Box>

        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ mt: 4, borderRadius: 3, textTransform: 'none', fontWeight: 'bold' }}
        >
          {supabase.isMock ? "Сбросить сессию" : "Выйти из аккаунта"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};