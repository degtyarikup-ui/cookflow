import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Box, Typography, Button, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const PremiumModal = () => {
  const { isPremium, setIsPremium } = useAppContext();
  const [loading, setLoading] = useState(false);

  const togglePremium = () => {
    setLoading(true);
    setTimeout(() => {
      setIsPremium(!isPremium);
      setLoading(false);
    }, 800);
  };

  return (
    <Box sx={{ p: 2, pb: 12, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'warning.50', color: 'warning.main', border: '1px solid', borderColor: 'warning.100' }}>
            <StarIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>Premium</Typography>
            <Typography variant="caption" color="text.secondary">Раскройте весь потенциал</Typography>
          </Box>
        </Box>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden', mb: 3, position: 'relative' }}>
        <Box sx={{ p: 4, bgcolor: 'grey.900', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
            <StarIcon sx={{ fontSize: 120 }} />
          </Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>CookFlow PRO</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>Ваш личный шеф-повар и диетолог</Typography>
        </Box>

        <List sx={{ px: 2, py: 1 }}>
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 40 }}><AutoAwesomeIcon color="primary" /></ListItemIcon>
            <ListItemText primary="AI-генерация меню" secondary="Персональный план на неделю в один клик" secondaryTypographyProps={{ variant: 'caption' }} />
          </ListItem>
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 40 }}><RestaurantMenuIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Эксклюзивные рецепты" secondary="От мишленовских поваров до уличной еды" secondaryTypographyProps={{ variant: 'caption' }} />
          </ListItem>
          <ListItem disableGutters>
            <ListItemIcon sx={{ minWidth: 40 }}><AdUnitsIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Режим готовки PRO" secondary="Голосовое управление и отсутствие рекламы" secondaryTypographyProps={{ variant: 'caption' }} />
          </ListItem>
        </List>
      </Paper>

      <Box sx={{ flex: 1 }} />

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, bgcolor: isPremium ? 'success.50' : 'white', borderColor: isPremium ? 'success.200' : 'grey.200' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isPremium ? <CheckCircleIcon color="success" /> : <StarIcon sx={{ color: '#F59E0B' }} />}
          <Typography variant="subtitle1" fontWeight="bold">
            {isPremium ? 'Подписка активна' : 'Стать PRO (Демо)'}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 1 }}>
          {isPremium ? 'Вам доступны все функции CookFlow. Готовьте с удовольствием!' : 'Попробуйте все функции бесплатно в рамках демо-версии.'}
        </Typography>

        <Button
          variant="contained"
          fullWidth
          disabled={loading}
          onClick={togglePremium}
          color={isPremium ? "error" : "primary"}
          sx={{ borderRadius: 8, py: 1.5, fontWeight: 'bold', textTransform: 'none', fontSize: '1.1rem' }}
        >
          {loading ? 'Обработка...' : (isPremium ? 'Отменить подписку' : 'Включить PRO бесплатно')}
        </Button>
      </Paper>
    </Box>
  );
};