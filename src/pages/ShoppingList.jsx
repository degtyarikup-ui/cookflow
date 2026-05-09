import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Box, Typography, Checkbox, List, ListItem, ListItemIcon, ListItemText, Paper, Divider, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const ShoppingList = () => {
  const { planner, recipes } = useAppContext();
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (item) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const shoppingList = useMemo(() => {
    const list = {};
    Object.values(planner).forEach(day => {
      Object.values(day).forEach(recipeId => {
        const recipe = recipes.find(r => r.id === recipeId);
        if (recipe) {
          recipe.ingredients.forEach(ing => {
            // Simple mock parser: strip numbers and standard units for grouping
            const cleanName = ing.replace(/^[0-9/\.\s]+(г|мл|шт|ст\.л\.|ч\.л\.|зубчика|зубчик|ст|кг|литр|л)\s+/i, '').toLowerCase().trim();
            if (list[cleanName]) {
              list[cleanName].raw.push(ing);
            } else {
              list[cleanName] = { raw: [ing] };
            }
          });
        }
      });
    });
    return list;
  }, [planner, recipes]);

  const items = Object.entries(shoppingList);

  return (
    <Box sx={{ p: 2, pb: 12 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.50', color: 'primary.main', border: '1px solid', borderColor: 'primary.100' }}>
            <ShoppingCartIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>Список покупок</Typography>
            <Typography variant="caption" color="text.secondary">Умный парсинг из меню</Typography>
          </Box>
        </Box>
      </Box>

      {items.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'white', borderRadius: 4, border: '1px solid', borderColor: 'grey.200', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <LocalGroceryStoreIcon sx={{ fontSize: 48, color: 'grey.300' }} />
          <Typography variant="body2" color="text.secondary">Ваш список пуст. Спланируйте меню, и мы автоматически соберем корзину продуктов.</Typography>
        </Box>
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ p: 2, bgcolor: 'primary.50', display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberIcon color="warning" fontSize="small" />
            <Typography variant="caption" color="text.secondary">Количество суммировано примерно</Typography>
          </Box>
          <List disablePadding>
            {items.map(([key, data], idx) => {
              const isChecked = checkedItems[key];
              return (
                <React.Fragment key={key}>
                  <ListItem
                    button
                    onClick={() => toggleCheck(key)}
                    sx={{ bgcolor: isChecked ? 'grey.50' : 'white', opacity: isChecked ? 0.6 : 1, transition: 'all 0.2s' }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Checkbox
                        edge="start"
                        checked={!!isChecked}
                        disableRipple
                        sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography sx={{ textDecoration: isChecked ? 'line-through' : 'none', textTransform: 'capitalize' }}>{key}</Typography>}
                      secondary={data.raw.join(' + ')}
                      secondaryTypographyProps={{ sx: { display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', textDecoration: isChecked ? 'line-through' : 'none' } }}
                    />
                  </ListItem>
                  {idx < items.length - 1 && <Divider component="li" />}
                </React.Fragment>
              );
            })}
          </List>
        </Paper>
      )}
    </Box>
  );
};