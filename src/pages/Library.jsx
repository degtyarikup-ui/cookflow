import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Card, CardContent, IconButton, Chip } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export const Library = () => {
  const { recipes, savedIds, toggleSave } = useAppContext();
  const navigate = useNavigate();

  const savedRecipes = recipes.filter(r => savedIds.includes(r.id));

  return (
    <Box sx={{ p: 2, pb: 12 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.50', color: 'primary.main', border: '1px solid', borderColor: 'primary.100' }}>
            <BookmarkIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>Мои рецепты</Typography>
            <Typography variant="caption" color="text.secondary">Сохраненные блюда</Typography>
          </Box>
        </Box>
      </Box>

      {savedRecipes.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'white', borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary">У вас пока нет сохраненных рецептов. Сохраняйте их из ленты!</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {savedRecipes.map(recipe => (
            <Card key={recipe.id} variant="outlined" sx={{ borderRadius: 4, display: 'flex', overflow: 'hidden' }}>
              <Box sx={{ width: 100, flexShrink: 0, position: 'relative' }}>
                <Box className={`absolute inset-0 bg-gradient-to-br ${recipe.color}`} />
                <IconButton
                  aria-label="Готовить"
                  onClick={() => navigate(`/cooking/${recipe.id}`)}
                  sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'white', '&:hover': { bgcolor: 'white' }, boxShadow: 2 }}
                  size="small"
                >
                  <PlayArrowIcon color="primary" fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
                <CardContent sx={{ p: 1.5, pb: "12px !important" }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ pr: 3, lineHeight: 1.2, mb: 0.5 }}>{recipe.title}</Typography>
                    <IconButton
                      aria-label="Удалить из сохраненных"
                      size="small"
                      onClick={() => toggleSave(recipe.id)}
                      sx={{ position: 'absolute', top: 4, right: 4 }}
                    >
                      <BookmarkIcon color="primary" fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 1 }}>
                    {recipe.shortDescription}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip icon={<AccessTimeIcon sx={{ fontSize: '14px !important' }} />} label={recipe.duration} size="small" variant="outlined" sx={{ fontSize: '10px', height: 20 }} />
                    <Chip label={recipe.calories} size="small" variant="outlined" sx={{ fontSize: '10px', height: 20 }} />
                  </Box>
                </CardContent>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};