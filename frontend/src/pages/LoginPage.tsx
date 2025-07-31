// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import type { RootState, AppDispatch } from '../store';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

    const validate = () => {
        const errors: typeof formErrors = {};
        if (!email) errors.email = 'Email is required';
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) errors.email = 'Invalid email format';
        if (!password) errors.password = 'Password is required';
        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validate();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        const result = await dispatch(loginUser({ email, password }));
        if (loginUser.fulfilled.match(result)) {
            navigate('/');
        }
    };

    return (
        <Box maxWidth={400} mx="auto" mt={5}>
            <Typography variant="h5" gutterBottom>Login</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                />
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ mt: 2 }}>
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </form>
        </Box>
    );
};

export default LoginPage;
