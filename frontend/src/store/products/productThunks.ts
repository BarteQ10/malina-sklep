import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Product } from '../../types/product';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const fetchProducts = createAsyncThunk<Product[], 'pl' | 'en'>(
    'products',
    async (language) => {
        const response = await axios.get<Product[]>(`${API}/products/${language}`);
        return response.data;
    }
);
