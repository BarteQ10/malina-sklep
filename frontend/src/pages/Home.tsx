import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../store/products/productThunks';
import type { Product } from '../types/product';
import type { HomeProps } from '../types/components';
import ProductCard from '../components/ProductCard';
import { Container, Grid } from '@mui/material';

const Home: React.FC<HomeProps> = ({ language }) => {
    const dispatch = useAppDispatch();
    const products = useAppSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts(language));
    }, [dispatch, language]);

    return (
        <Container maxWidth={false} sx={{ mt: 6 }}>
            <Grid container spacing={3}>
                {products.map((product: Product) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 3, xxl: 2 }} key={product.id}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Home;
