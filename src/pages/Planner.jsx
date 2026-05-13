import { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Box, Typography, Button, Paper, IconButton } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MEALS = ["Завтрак", "Обед", "Ужин"];

export const Planner = () => {
  const { planner, setPlanner, recipes, isPremium } = useAppContext();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMenu = async () => {
    if (!isPremium) {
      navigate('/premium');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-menu');
      if (error) throw error;
      if (data?.plan?.plan_data) {
        setPlanner(data.plan.plan_data);
      }
    } catch (e) {
      console.error("Error generating menu:", e);
      alert("Ошибка при генерации меню: " + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearPlanner = async () => {
    setPlanner({});
    if (!supabase.isMock) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('weekly_plans').delete().eq('user_id', user.id);
      }
    }
  };

  const recipesById = useMemo(() => {
    return recipes.reduce((acc, recipe) => {
      acc[recipe.id] = recipe;
      return acc;
    }, {});
  }, [recipes]);

  return (
    <Box sx={{ p: 2, pb: 12 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.50', color: 'primary.main', border: '1px solid', borderColor: 'primary.100' }}>
            <CalendarTodayIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>План на неделю</Typography>
            <Typography variant="caption" color="text.secondary">Ваше меню</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={isPremium ? <AutoAwesomeIcon /> : <LockIcon />}
          onClick={generateMenu}
          disabled={isGenerating}
          sx={{ bgcolor: 'grey.900', color: 'white', '&:hover': { bgcolor: 'grey.800' }, borderRadius: 3, py: 1.5, textTransform: 'none', fontWeight: 'bold' }}
        >
          {isGenerating ? 'Нейросеть составляет...' : 'AI-генерация меню'}
        </Button>
        {Object.keys(planner).length > 0 && (
          <Button variant="outlined" color="error" onClick={clearPlanner} sx={{ borderRadius: 3, minWidth: 'auto', px: 2 }}>
            Очистить
          </Button>
        )}
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'grey.100', bgcolor: 'grey.50' }}>
          <Box sx={{ w: '40px', flexShrink: 0, p: 1 }} />
          {DAYS.map(day => (
            <Box key={day} sx={{ flex: 1, textAlign: 'center', py: 1, borderLeft: 1, borderColor: 'grey.100' }}>
              <Typography variant="caption" fontWeight="bold" color="text.secondary">{day}</Typography>
            </Box>
          ))}
        </Box>

        {MEALS.map((meal, mIdx) => (
          <Box key={meal} sx={{ display: 'flex', borderBottom: mIdx < MEALS.length - 1 ? 1 : 0, borderColor: 'grey.100' }}>
            <Box sx={{ w: '40px', flexShrink: 0, p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRight: 1, borderColor: 'grey.100' }}>
              <Typography variant="caption" fontWeight="medium" color="text.secondary" sx={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                {meal}
              </Typography>
            </Box>
            {DAYS.map(day => {
              const assignedId = planner[day]?.[meal];
              const recipe = assignedId ? recipesById[assignedId] : null;

              return (
                <Box key={day} sx={{ flex: 1, borderLeft: 1, borderColor: 'grey.100', p: 0.5, minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', '&:hover': { bgcolor: 'grey.50' } }}>
                  {recipe ? (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ fontSize: '9px', fontWeight: 'bold', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.1 }}>
                        {recipe.title}
                      </Typography>
                    </Box>
                  ) : (
                    <IconButton aria-label="Добавить блюдо" size="small" sx={{ opacity: 0.3 }}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              );
            })}
          </Box>
        ))}
      </Paper>
    </Box>
  );
};
