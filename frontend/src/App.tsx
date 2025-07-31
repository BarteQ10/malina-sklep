import React, { useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import ContactPage from './pages/ContactPage';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>(
    (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light'
  );
  const [language, setLanguage] = useState<'pl' | 'en'>('pl');

  const theme = useMemo(
    () =>
      createTheme({
        breakpoints: {
          values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
            xxl: 2000, // Custom breakpoint
          },
        },
        palette: {
          mode,
          primary: {
            main: '#c2185b',
          },
        },
      }),
    [mode]
  );

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };
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
            <Header
              mode={mode}
              language={language}
              toggleMode={toggleMode}
              handleLanguageChange={handleLanguageChange}
            />
            <Routes>
              <Route path="/" element={<Home language={language} />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default App;