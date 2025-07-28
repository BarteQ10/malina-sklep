import React, { useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import ContactPage from './pages/ContactPage';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { useTranslation } from 'react-i18next';

const NavigationBar: React.FC<{
  mode: 'light' | 'dark';
  language: 'pl' | 'en';
  toggleMode: () => void;
  handleLanguageChange: (lang: 'pl' | 'en') => void;
}> = ({ mode, language, toggleMode, handleLanguageChange }) => {
  const { t } = useTranslation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t('title')}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/contact">
            {t('contact')}
          </Button>

          <Select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as 'pl' | 'en')}
            size="small"
            sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
          >
            <MenuItem value="pl">PL</MenuItem>
            <MenuItem value="en">EN</MenuItem>
          </Select>

          <IconButton onClick={toggleMode} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const App: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'pl' | 'en'>('pl');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#c2185b',
          },
        },
      }),
    [mode]
  );

  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  const handleLanguageChange = (lang: 'pl' | 'en') => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <NavigationBar
              mode={mode}
              language={language}
              toggleMode={toggleMode}
              handleLanguageChange={handleLanguageChange}
            />
            <Routes>
              <Route path="/" element={<Home language={language} />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default App;