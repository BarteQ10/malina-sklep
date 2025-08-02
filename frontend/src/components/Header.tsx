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
import { useAppDispatch, useAppSelector } from '../store/hooks';
//import { logout } from '../store/authSlice';

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
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);

    const handleLogout = () => {
        //dispatch(logout());
        navigate('/');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {t('title')}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button color="inherit" component={Link} to="/">
                        {t('home')}
                    </Button>
                    <Button color="inherit" component={Link} to="/contact">
                        {t('contact')}
                    </Button>

                    <Select
                        value={language}
                        onChange={(e) => handleLanguageChange(e.target.value as 'pl' | 'en')}
                        size="small"
                        variant="outlined"
                        sx={{
                            color: 'white',
                            minWidth: 80,
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'white',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'white',
                            },
                            '& .MuiSvgIcon-root': {
                                color: 'white',
                            },
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

                    <IconButton onClick={toggleMode} color="inherit">
                        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>

                    {!user ? (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                {t('login')}
                            </Button>
                            <Button color="inherit" component={Link} to="/register">
                                {t('register')}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="body1">
                                {user.name || user.email}
                            </Typography>
                            <Button color="inherit" onClick={handleLogout}>
                                {t('logout')}
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
