import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState, AppDispatch } from '../store';
import { fetchProducts } from '../store/productSlice';
import type { Product } from '../store/productSlice';
import { Link } from 'react-router-dom';

import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
} from '@mui/material';

interface HomeProps {
    language: 'pl' | 'en';
}

const Home: React.FC<HomeProps> = ({ language }) => {
    const dispatch = useDispatch<AppDispatch>();
    const products = useSelector((state: RootState) => state.products);
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(fetchProducts(language));
    }, [dispatch, language]);

    return (
        <Container sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                {products.map((p: Product) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={p.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{p.name}</Typography>
                                <Typography color="text.secondary">
                                    {p.price} {language === 'pl' ? 'zł' : 'PLN'}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button component={Link} to={`/product/${p.id}`} size="small">
                                    {t('details')}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Home;
