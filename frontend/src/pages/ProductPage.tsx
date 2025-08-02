import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/types';
import { Container, Typography, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const product = useSelector((state: RootState) =>
        state.products.find((p) => p.id === parseInt(id || ''))
    );

    if (!product)
        return (
            <Container sx={{ mt: 4 }}>
                <Typography variant="h6">{t('notFound')}</Typography>
            </Container>
        );

    return (
        <Container sx={{ mt: 4 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4">{product.name}</Typography>
                    <Typography variant="h6" color="text.secondary">
                        {t('price')}: {product.price} PLN
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {t('description')}: {product.description}
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
};

export default ProductPage;