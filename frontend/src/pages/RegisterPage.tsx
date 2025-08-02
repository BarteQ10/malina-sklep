// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/auth/authThunks';
import type { RootState, AppDispatch } from '../store/types';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [formErrors, setFormErrors] = useState<{ email?: string; password?: string; name?: string }>({});

    const validate = () => {
        const errors: typeof formErrors = {};
        if (!name || name.length < 2 || name.length > 50) errors.name = 'Name must be 2–50 characters';
        if (!email) errors.email = 'Email is required';
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) errors.email = 'Invalid email format';
        if (!password) errors.password = 'Password is required';
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password))
            errors.password = 'Password must be 8+ chars with upper, lower, number & special char';
        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validate();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        const result = await dispatch(registerUser({ email, password, name }));
        if (registerUser.fulfilled.match(result)) {
            navigate('/login');
        }
    };

    return (
        <Box maxWidth={400} mx="auto" mt={5}>
            <Typography variant="h5" gutterBottom>Register</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                />
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
                    {loading ? 'Registering...' : 'Register'}
                </Button>
            </form>
        </Box>
    );
};

export default RegisterPage;
