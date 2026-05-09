import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Box, Typography, IconButton, Button, LinearProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion, AnimatePresence } from 'framer-motion';

export const CookingMode = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipes } = useAppContext();

  const recipe = recipes.find(r => r.id === id);
  const [currentStep, setCurrentStep] = useState(-1); // -1 is ingredients, 0+ are steps

  if (!recipe) {
    return <Box sx={{ p: 4 }}>Рецепт не найден</Box>;
  }

  const totalSteps = recipe.steps.length;
  const progress = currentStep === -1 ? 0 : ((currentStep + 1) / totalSteps) * 100;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > -1) {
      setCurrentStep(curr => curr - 1);
    }
  };

  return (
    <Box sx={{ height: '100dvh', width: '100%', bgcolor: 'black', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="caption" fontWeight="bold">РЕЖИМ ГОТОВКИ</Typography>
        <Box sx={{ width: 40 }} /> {/* Spacer */}
      </Box>

      <Box sx={{ px: 2, mb: 2 }}>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: '#F97316' } }} />
      </Box>

      <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          {currentStep === -1 ? (
            <motion.div
              key="ingredients"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>{recipe.title}</Typography>
              <Typography variant="subtitle1" color="grey.400" sx={{ mb: 4 }}>Подготовьте ингредиенты</Typography>

              <Box sx={{ width: '100%', maxWidth: 400, textAlign: 'left', bgcolor: 'rgba(255,255,255,0.1)', p: 3, borderRadius: 4, maxHeight: '50vh', overflowY: 'auto' }}>
                {recipe.ingredients.map((ing, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#F97316' }} />
                    <Typography variant="body1">{ing}</Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full h-full flex flex-col items-center justify-center p-8 text-center"
            >
              <Typography variant="h1" fontWeight="bold" sx={{ color: 'rgba(255,255,255,0.1)', position: 'absolute', top: 20, fontSize: '12rem', zIndex: 0 }}>
                {currentStep + 1}
              </Typography>

              <Typography variant="h4" fontWeight="medium" sx={{ zIndex: 1, lineHeight: 1.4 }}>
                {recipe.steps[currentStep]}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 'calc(2rem + env(safe-area-inset-bottom))' }}>
        <IconButton
          onClick={prevStep}
          disabled={currentStep === -1}
          sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64, '&:disabled': { opacity: 0.3 } }}
        >
          <ArrowBackIcon fontSize="large" />
        </IconButton>

        {currentStep === totalSteps - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)}
            startIcon={<CheckCircleIcon />}
            sx={{ borderRadius: 8, height: 64, px: 4, fontSize: '1.2rem', fontWeight: 'bold' }}
          >
            Готово!
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={nextStep}
            endIcon={<ArrowForwardIcon />}
            sx={{ borderRadius: 8, height: 64, px: 4, fontSize: '1.2rem', fontWeight: 'bold' }}
          >
            {currentStep === -1 ? 'Начать' : 'Дальше'}
          </Button>
        )}
      </Box>
    </Box>
  );
};