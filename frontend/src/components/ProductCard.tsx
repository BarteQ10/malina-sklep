import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Card,
    CardContent,
    CardActions,
    CardMedia,
    Typography,
    Button,
} from '@mui/material';
import type { Product } from '../types/product';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { t } = useTranslation();

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                sx={{
                    height: 200,
                    backgroundColor: 'grey.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    {t('image_placeholder')}
                </Typography>
            </CardMedia>
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    {product.name}
                </Typography>
                <Typography variant="h6" color="primary">
                    {product.price.toFixed(2)} {t('zł')}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    component={Link}
                    to={`/product/${product.id}`}
                    size="small"
                    variant="outlined"
                    fullWidth
                >
                    {t('details')}
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;