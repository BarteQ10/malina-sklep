// src/components/Header.tsx
import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Select,
    MenuItem,
    IconButton,
    Box,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { logout } from '../store/authSlice';

type HeaderProps = {
    mode: 'light' | 'dark';
    language: 'pl' | 'en';
    toggleMode: () => void;
    handleLanguageChange: (lang: 'pl' | 'en') => void;
};

const Header: React.FC<HeaderProps> = ({
    mode,
    language,
    toggleMode,
    handleLanguageChange,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

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

                    {/* Language Selector */}
                    <Select
                        value={language}
                        onChange={(e) => handleLanguageChange(e.target.value as 'pl' | 'en')}
                        size="small"
                        sx={{
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                            '& .MuiSvgIcon-root': { color: 'white' },
                        }}
                    >
                        <MenuItem value="pl">
                            <Box component="img" src="/flags/pl.png" alt="PL" sx={{ width: 20, mr: 1 }} />
                            PL
                        </MenuItem>
                        <MenuItem value="en">
                            <Box component="img" src="/flags/gb.png" alt="EN" sx={{ width: 20, mr: 1 }} />
                            EN
                        </MenuItem>
                    </Select>

                    {/* Theme Toggle */}
                    <IconButton onClick={toggleMode} color="inherit">
                        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>

                    {/* Auth Buttons */}
                    {!user ? (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                {t('login') ?? 'Login'}
                            </Button>
                            <Button color="inherit" component={Link} to="/register">
                                {t('register') ?? 'Register'}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="body1">{user.name || user.email}</Typography>
                            <Button color="inherit" onClick={handleLogout}>
                                {t('logout') ?? 'Logout'}
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
