import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Product } from '../types/product';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const fetchProducts = createAsyncThunk<Product[], 'pl' | 'en'>(
    'products/fetch',
    async (language) => {
        const response = await axios.get<Product[]>(`${API_BASE_URL}/products/${language}`);
        return response.data;
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: [] as Product[],
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.fulfilled, (_, action) => action.payload);
    },
});

export default productSlice.reducer;