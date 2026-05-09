import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { BottomNavigation, BottomNavigationAction, Paper, ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import StarIcon from '@mui/icons-material/Star'

import { AppProvider } from './context/AppContext'

// Layout component to handle routing and bottom nav
const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  let value = 0;
  switch (location.pathname) {
    case '/': value = 0; break;
    case '/library': value = 1; break;
    case '/planner': value = 2; break;
    case '/shopping': value = 3; break;
    case '/premium': value = 4; break;
    default: value = 0;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-soft">
      <main className="flex-1 overflow-hidden relative pb-[70px]">
        {children}
      </main>
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
import { CookingMode } from './pages/CookingMode'
import { Planner } from './pages/Planner'
import { ShoppingList } from './pages/ShoppingList'
import { PremiumModal } from './pages/PremiumModal'


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <BrowserRouter basename="/cookflow/">
          <Routes>
            <Route path="/" element={<Layout><Feed /></Layout>} />
            <Route path="/library" element={<Layout><Library /></Layout>} />
            <Route path="/planner" element={<Layout><Planner /></Layout>} />
            <Route path="/shopping" element={<Layout><ShoppingList /></Layout>} />
            <Route path="/premium" element={<Layout><PremiumModal /></Layout>} />
            <Route path="/cooking/:id" element={<CookingMode />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App
