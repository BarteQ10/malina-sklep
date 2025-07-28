import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}

export const fetchProducts = createAsyncThunk<Product[], 'pl' | 'en'>(
    'products/fetch',
    async (language) => {
        const response = await axios.get<Product[]>('http://localhost:4000/products/' + language);
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