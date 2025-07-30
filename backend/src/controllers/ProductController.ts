import { Controller, Get, Route, Path, Tags } from 'tsoa';
import { prisma } from '../prisma';
import { HttpError } from '../utils/errors';

interface ProductResponse {
    id: number;
    price: number;
    name: string;
    description: string;
}

@Route('products')
@Tags('Products')
export class ProductController extends Controller {
    @Get('{lang}')
    public async getProducts(@Path() lang: string): Promise<ProductResponse[]> {
        if (!['pl', 'en'].includes(lang)) {
            throw new HttpError(400, 'Invalid language');
        }

        const products = await prisma.product.findMany({
            include: {
                translations: {
                    where: { lang },
                    select: { name: true, description: true },
                },
            },
        });

        return products.map((p) => ({
            id: p.id,
            price: p.price,
            name: p.translations[0]?.name ?? 'No name',
            description: p.translations[0]?.description ?? '',
        }));
    }
}
