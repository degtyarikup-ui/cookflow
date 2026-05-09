import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LockIcon from '@mui/icons-material/Lock';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { Dialog, DialogTitle, DialogContent, Button, IconButton, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const RecipeModal = ({ open, onClose, recipe }) => {
  if (!recipe) return null;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4, maxHeight: '85vh' } }}>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RestaurantIcon color="primary" />
          <Typography variant="subtitle1" fontWeight="bold">Ингредиенты & Шаги</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2, pb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>{recipe.title}</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>{recipe.shortDescription}</Typography>

        <Box sx={{ mt: 3, mb: 1 }}>
          <Typography variant="overline" color="text.secondary" fontWeight="bold">Ингредиенты</Typography>
          <List dense disablePadding>
            {recipe.ingredients.map((ing, idx) => (
              <ListItem key={idx} disableGutters sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 24 }}><div className="h-1.5 w-1.5 rounded-full bg-primary-400" /></ListItemIcon>
                <ListItemText primary={ing} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="overline" color="text.secondary" fontWeight="bold">Шаги</Typography>
          <List dense disablePadding>
            {recipe.steps.map((step, idx) => (
              <ListItem key={idx} disableGutters sx={{ py: 1, alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-50 text-[11px] font-semibold text-primary-700">{idx + 1}</div>
                </ListItemIcon>
                <ListItemText primary={step} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const ReelCard = ({ recipe, isSaved, onToggleSave, onOpenIngredients, isPremiumUser }) => {
  const [liked, setLiked] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const navigate = useNavigate();
  const lastTapRef = useRef(0);

  const isLocked = recipe.isPremium && !isPremiumUser;

  const handleDoubleTap = () => {
    if (isLocked) return;
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (!liked) setLiked(true);
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
    }
    lastTapRef.current = now;
  };

  return (
    <div className="relative w-full flex flex-col bg-slate-900 overflow-hidden" style={{ minHeight: '100dvh' }} onClick={handleDoubleTap}>
      {!isLocked && recipe.youtubeId ? (
         <ReactPlayer
           url={`https://www.youtube.com/watch?v=${recipe.youtubeId}`}
           playing={true}
           loop={true}
           muted={true}
           width="100%"
           height="100%"
           style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
           config={{
             youtube: {
               playerVars: { controls: 0, rel: 0, modestbranding: 1, playsinline: 1 }
             }
           }}
         />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${recipe.color} flex items-center justify-center`}>
          {isLocked && (
            <div className="flex flex-col items-center bg-black/50 p-6 rounded-2xl backdrop-blur-md">
              <LockIcon sx={{ color: '#F59E0B', fontSize: 48, mb: 2 }} />
              <Typography variant="h6" color="white" fontWeight="bold" textAlign="center">Premium Рецепт</Typography>
              <Typography variant="body2" color="white" sx={{ opacity: 0.8, mt: 1, mb: 3 }} textAlign="center">Подпишитесь, чтобы открыть</Typography>
              <Button variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); navigate('/premium'); }} sx={{ borderRadius: 8, textTransform: 'none', fontWeight: 'bold' }}>
                Перейти к Premium
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

      {/* Double tap heart animation overlay */}
      <AnimatePresence>
        {showHeartAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: '-50%', x: '-50%' }}
            animate={{ opacity: 1, scale: 1.5, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="absolute top-1/2 left-1/2 pointer-events-none z-20 text-red-500 drop-shadow-2xl"
          >
            <FavoriteIcon sx={{ fontSize: 120 }} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute left-4 top-[max(env(safe-area-inset-top),1rem)] inline-flex items-center gap-1.5 rounded-full bg-black/40 border border-white/10 px-3 py-1.5 text-xs font-medium text-white pointer-events-none z-10">
        <LocalFireDepartmentIcon sx={{ fontSize: 16 }} /> {recipe.isPremium ? 'Эксклюзив' : 'В тренде'}
      </div>

      <div className="absolute right-4 bottom-[calc(6rem+env(safe-area-inset-bottom))] flex flex-col items-center gap-6 z-10">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="flex flex-col items-center gap-1"
        >
          <div className="p-3 bg-black/40 rounded-full backdrop-blur-md border border-white/10 text-white shadow-lg">
            {liked ? <FavoriteIcon sx={{ color: '#ef4444' }} /> : <FavoriteBorderIcon />}
          </div>
          <span className="text-white text-xs font-medium drop-shadow-md">{liked ? '1.2k' : '1.1k'}</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); onToggleSave(recipe.id); }}
          className="flex flex-col items-center gap-1"
        >
          <div className={`p-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg transition-colors ${isSaved ? 'bg-primary-500 text-white' : 'bg-black/40 text-white'}`}>
            {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </div>
          <span className="text-white text-xs font-medium drop-shadow-md">Сохранить</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => { e.stopPropagation(); navigate(`/cooking/${recipe.id}`); }}
          className="flex flex-col items-center gap-1"
        >
          <div className="p-3 bg-black/40 rounded-full backdrop-blur-md border border-white/10 text-white shadow-lg">
            <PlayArrowIcon />
          </div>
          <span className="text-white text-xs font-medium drop-shadow-md">Готовить</span>
        </motion.button>
      </div>

      <div className="absolute bottom-0 left-0 right-20 p-4 pb-[calc(6rem+env(safe-area-inset-bottom))] space-y-3 z-10">
        <div className="flex items-center gap-2 text-xs text-white/90">
          <Chip icon={<AccessTimeIcon sx={{ color: 'white !important', fontSize: 16 }} />} label={recipe.duration} size="small" sx={{ backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }} />
          <Chip label={recipe.calories} size="small" sx={{ backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }} />
        </div>
        <h3 className="text-xl font-bold text-white leading-tight drop-shadow-lg">{recipe.title}</h3>
        <p className="text-sm text-white/90 drop-shadow-md">{recipe.shortDescription}</p>

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            startIcon={<ListAltIcon />}
            onClick={(e) => { e.stopPropagation(); onOpenIngredients(recipe); }}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              color: 'text.primary',
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: 'white' }
            }}
            size="small"
          >
            Ингредиенты
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export const Feed = () => {
  const { recipes, savedIds, toggleSave, isPremium } = useAppContext();
  const [modalRecipe, setModalRecipe] = useState(null);

  return (
    <>
      <div className="reels-container fixed inset-0 top-0 left-0 right-0 bottom-0 bg-black">
        {recipes.map(recipe => (
          <ReelCard
            key={recipe.id}
            recipe={recipe}
            isSaved={savedIds.includes(recipe.id)}
            onToggleSave={toggleSave}
            onOpenIngredients={setModalRecipe}
            isPremiumUser={isPremium}
          />
        ))}
      </div>
      <RecipeModal open={!!modalRecipe} recipe={modalRecipe} onClose={() => setModalRecipe(null)} />
    </>
  );
};