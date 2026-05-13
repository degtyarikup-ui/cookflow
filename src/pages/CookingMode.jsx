import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Box, Typography, IconButton, Button, LinearProgress, Checkbox } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const Timer = ({ initialSeconds }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      clearInterval(interval);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsActive(false);
      // Optional: play sound here
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); setSeconds(initialSeconds); };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Typography variant="h3" fontWeight="bold" sx={{ color: seconds === 0 ? 'error.main' : 'primary.main', fontFamily: 'monospace' }}>
        {formatTime(seconds)}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant={isActive ? "outlined" : "contained"}
          color={isActive ? "error" : "primary"}
          onClick={toggleTimer}
          startIcon={<TimerIcon />}
          sx={{ borderRadius: 4, textTransform: 'none' }}
        >
          {isActive ? 'Пауза' : (seconds === initialSeconds ? 'Запустить таймер' : 'Продолжить')}
        </Button>
        {seconds < initialSeconds && (
           <Button variant="text" color="inherit" onClick={resetTimer} sx={{ opacity: 0.7 }}>Сброс</Button>
        )}
      </Box>
    </Box>
  );
};


export const CookingMode = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipes } = useAppContext();

  const recipe = recipes.find(r => r.id === id);
  const [currentStep, setCurrentStep] = useState(-1); // -1 is ingredients, 0+ are steps
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop speaking when leaving component
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

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

  const handleFinish = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F97316', '#F59E0B', '#10B981']
    });
    setTimeout(() => {
      navigate(-1);
    }, 2500);
  };

  const toggleIngredient = (idx) => {
    setCheckedIngredients(prev => ({...prev, [idx]: !prev[idx]}));
  };

  const handleSpeak = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU'; // Ensure Russian pronunciation
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Ваш браузер не поддерживает чтение текста голосом.");
    }
  };

  // Extract possible time from step to suggest a timer (very basic mock)
  const extractTimeInSeconds = (text) => {
    const match = text.match(/(\d+)\s*(минут|мин)/i);
    if (match) return parseInt(match[1]) * 60;
    return null;
  };

  return (
    <Box sx={{ height: '100dvh', width: '100%', bgcolor: 'black', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <IconButton aria-label="Закрыть режим готовки" onClick={() => navigate(-1)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}>
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
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px' }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">{recipe.title}</Typography>
              <Typography variant="subtitle1" color="grey.400" sx={{ mb: 4 }} textAlign="center">Подготовьте ингредиенты</Typography>

              <Box sx={{ width: '100%', maxWidth: 400, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 4, maxHeight: '55vh', overflowY: 'auto' }}>
                {recipe.ingredients.map((ing, idx) => {
                  const isChecked = !!checkedIngredients[idx];
                  return (
                    <Box
                      key={idx}
                      onClick={() => toggleIngredient(idx)}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 1, p: 2,
                        borderBottom: idx < recipe.ingredients.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        cursor: 'pointer',
                        opacity: isChecked ? 0.5 : 1,
                        transition: 'opacity 0.2s'
                      }}
                    >
                      <Checkbox
                        checked={isChecked}
                        sx={{ color: 'grey.500', '&.Mui-checked': { color: 'primary.main' }, p: 0 }}
                      />
                      <Typography variant="body1" sx={{ textDecoration: isChecked ? 'line-through' : 'none' }}>{ing}</Typography>
                    </Box>
                  )
                })}
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}
            >
              <Typography variant="h1" fontWeight="bold" sx={{ color: 'rgba(255,255,255,0.05)', position: 'absolute', top: 20, fontSize: '15rem', zIndex: 0, pointerEvents: 'none' }}>
                {currentStep + 1}
              </Typography>

              <Box sx={{ zIndex: 1, width: '100%', maxWidth: 500 }}>
                <Typography variant="h4" fontWeight="medium" sx={{ lineHeight: 1.4, mb: 3 }}>
                  {recipe.steps[currentStep]}
                </Typography>

                <IconButton
                  aria-label={isSpeaking ? 'Остановить озвучку' : 'Озвучить шаг'}
                  onClick={() => handleSpeak(recipe.steps[currentStep])}
                  sx={{ color: isSpeaking ? 'primary.main' : 'white', bgcolor: 'rgba(255,255,255,0.1)', mb: 2 }}
                  size="large"
                >
                  {isSpeaking ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>

                {extractTimeInSeconds(recipe.steps[currentStep]) && (
                  <Timer initialSeconds={extractTimeInSeconds(recipe.steps[currentStep])} />
                )}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      <Box sx={{ p: 4, display: 'flex', justifySelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center', pb: 'calc(2rem + env(safe-area-inset-bottom))' }}>
        <IconButton
          aria-label="Предыдущий шаг"
          onClick={prevStep}
          disabled={currentStep === -1}
          sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64, '&:disabled': { opacity: 0.3 } }}
        >
          <ArrowBackIcon fontSize="large" />
        </IconButton>

        {currentStep === totalSteps - 1 ? (
          <Button
            variant="contained"
            color="success"
            onClick={handleFinish}
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
