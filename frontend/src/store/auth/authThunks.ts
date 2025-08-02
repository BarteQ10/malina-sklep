import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { LoginData, RegisterData, AuthResponse } from './authTypes';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';



export const loginUser = createAsyncThunk<AuthResponse, LoginData, { rejectValue: string }>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API}/auth/login`, credentials);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk<void, RegisterData, { rejectValue: string }>(
    'auth/register',
    async (data, { rejectWithValue }) => {
        try {
            await axios.post(`${API}/auth/register`, data);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Registration failed');
        }
    }
);

// Optional: auto-refresh token
export const refreshToken = createAsyncThunk<{ token: string }, void>(
    'auth/refreshToken',
    async () => {
        const res = await axios.post(`${API}/auth/refresh`, {}, { withCredentials: true });
        return res.data;
    }
);
