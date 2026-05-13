import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { BottomNavigation, BottomNavigationAction, Paper, ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import StarIcon from '@mui/icons-material/Star'
import { AnimatePresence, motion } from 'framer-motion'

import { AppProvider } from './context/AppContext'

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      style={{ height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Feed /></PageWrapper>} />
        <Route path="/library" element={<PageWrapper><Library /></PageWrapper>} />
        <Route path="/planner" element={<PageWrapper><Planner /></PageWrapper>} />
        <Route path="/shopping" element={<PageWrapper><ShoppingList /></PageWrapper>} />
        <Route path="/premium" element={<PageWrapper><PremiumModal /></PageWrapper>} />
        <Route path="/cooking/:id" element={<PageWrapper><CookingMode /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};


// Layout component to handle routing and bottom nav
const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  let value = 0;
  if (location.pathname.startsWith('/library')) value = 1;
  else if (location.pathname.startsWith('/planner')) value = 2;
  else if (location.pathname.startsWith('/shopping')) value = 3;
  else if (location.pathname.startsWith('/premium')) value = 4;

  // Do not show bottom nav in cooking mode
  const isCookingMode = location.pathname.startsWith('/cooking');

  return (
    <div className="flex flex-col min-h-screen bg-background-soft">
      <main className="flex-1 overflow-hidden relative" style={{ paddingBottom: isCookingMode ? 0 : '70px' }}>
        {children}
      </main>

      {!isCookingMode && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              switch (newValue) {
                case 0: navigate('/'); break;
                case 1: navigate('/library'); break;
                case 2: navigate('/planner'); break;
                case 3: navigate('/shopping'); break;
                case 4: navigate('/premium'); break;
              }
            }}
            sx={{
               '& .MuiBottomNavigationAction-root': { minWidth: 'auto', padding: '6px 0' },
               paddingBottom: 'env(safe-area-inset-bottom)',
               height: 'calc(56px + env(safe-area-inset-bottom))'
            }}
          >
            <BottomNavigationAction label="Лента" icon={<HomeIcon />} />
            <BottomNavigationAction label="Рецепты" icon={<BookmarkIcon />} />
            <BottomNavigationAction label="План" icon={<CalendarMonthIcon />} />
            <BottomNavigationAction label="Список" icon={<ShoppingCartIcon />} />
            <BottomNavigationAction label="Premium" icon={<StarIcon sx={{ color: '#F59E0B' }}/>} />
          </BottomNavigation>
        </Paper>
      )}
    </div>
  );
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#F97316', // tailwind primary-500
    },
    background: {
      default: '#FAFAF9'
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

import { Feed } from './components/Feed'
import { Library } from './pages/Library'
import { AuthOverlay } from './components/AuthOverlay'
import { Onboarding } from './pages/Onboarding'
import { useAppContext } from './context/AppContext'
import { CookingMode } from './pages/CookingMode'
import { Planner } from './pages/Planner'
import { ShoppingList } from './pages/ShoppingList'
import { PremiumModal } from './pages/PremiumModal'
import { ProfileOverlay } from './components/ProfileOverlay'
import { useState } from 'react'
import { Avatar, IconButton } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'


const AppContent = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { session, profile } = useAppContext();

  if (!session) {
    return <AuthOverlay />;
  }

  // Show onboarding if dietary preferences are strictly null (not set yet)
  if (profile && profile.dietary_preferences === null) {
    return <Onboarding />;
  }

  return (
    <BrowserRouter basename="/cookflow/">
      <div className="fixed top-0 right-0 z-50 p-4 pt-[max(env(safe-area-inset-top),1rem)]">
        <IconButton aria-label="Профиль" onClick={() => setProfileOpen(true)} sx={{ bgcolor: 'white', boxShadow: 1, '&:hover': { bgcolor: 'grey.100' } }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            <PersonIcon fontSize="small" />
          </Avatar>
        </IconButton>
      </div>
      <ProfileOverlay open={profileOpen} onClose={() => setProfileOpen(false)} />

      <Layout>
        <AnimatedRoutes />
      </Layout>
    </BrowserRouter>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  )
}

export default App