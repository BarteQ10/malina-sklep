import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, refreshToken } from './authThunks';
import type { AuthState } from './authTypes';

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem('auth');
        },
        loadFromStorage(state) {
            const stored = localStorage.getItem('auth');
            if (stored) {
                const parsed = JSON.parse(stored);
                state.user = parsed.user;
                state.token = parsed.token;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('auth', JSON.stringify(action.payload));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload.token;
                localStorage.setItem('auth', JSON.stringify({ user: state.user, token: action.payload.token }));
            });
    },
});

export const { logout, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;
