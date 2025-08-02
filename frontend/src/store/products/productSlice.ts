import { createSlice } from '@reduxjs/toolkit';
import { fetchProducts } from './productThunks';
import type { Product } from '../../types/product';

const productSlice = createSlice({
    name: 'products',
    initialState: [] as Product[],
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.fulfilled, (_, action) => action.payload);
    },
});

export default productSlice.reducer;
