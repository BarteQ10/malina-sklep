import {
    Controller,
    Get,
    Post,
    Route,
    Path,
    Tags,
    UploadedFile,
    FormField,
    Request,
} from 'tsoa';
import { prisma } from '../prisma';
import { HttpError } from '../utils/errors';
import { Request as ExRequest } from 'express';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

interface ProductResponse {
    id: number;
    price: number;
    name: string;
    description: string;
    imageUrl?: string;
    thumbnailUrl?: string;
}

interface ProductTranslationInput {
    lang: string;
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
            thumbnailUrl: p.image ? `/uploads/thumbnails/${p.image}` : undefined,
        }));
    }

    @Get('{lang}/{id}')
    public async getProductById(@Path() lang: string, @Path() id: number): Promise<ProductResponse> {
        if (!['pl', 'en'].includes(lang)) {
            throw new HttpError(400, 'Invalid language');
        }

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                translations: {
                    where: { lang },
                    select: { name: true, description: true },
                },
            },
        });

        if (!product) {
            throw new HttpError(404, 'Product not found');
        }

        return {
            id: product.id,
            price: product.price,
            name: product.translations[0]?.name ?? 'No name',
            description: product.translations[0]?.description ?? '',
            // Pełnowymiarowe zdjęcie dla pojedynczego produktu
            imageUrl: product.image ? `/uploads/${product.image}` : undefined,
        };
    }

    @Post()
    public async createProduct(
        @FormField() price: string,
        @FormField() translation: string, // JSON string
        @UploadedFile() image?: Express.Multer.File,
        @Request() req?: ExRequest
    ): Promise<ProductResponse> {

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice)) {
            throw new HttpError(400, 'Invalid price');
        }

        let parsedTranslation: ProductTranslationInput;

        try {
            parsedTranslation = JSON.parse(translation);
        } catch (error) {
            throw new HttpError(400, 'Invalid JSON in translation');
        }

        const { lang, name, description } = parsedTranslation;

        if (!['pl', 'en'].includes(lang)) {
            throw new HttpError(400, 'Invalid language');
        }

        if (!name || !description) {
            throw new HttpError(400, 'Missing name or description');
        }

        let filename: string | undefined;
        if (image) {
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedMimeTypes.includes(image.mimetype)) {
                throw new HttpError(400, 'Invalid file type. Only JPG, PNG, WebP, and GIF are allowed.');
            }

            const maxSizeInBytes = 2 * 1024 * 1024;
            if (image.size > maxSizeInBytes) {
                throw new HttpError(400, 'File is too large. Max size is 2MB.');
            }
            const uploadDir = path.join(__dirname, '../../public/uploads');
            const thumbDir = path.join(uploadDir, 'thumbnails');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
            if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

            filename = `${Date.now()}_${image.originalname}`;

            fs.writeFileSync(path.join(uploadDir, filename), image.buffer);

            await sharp(image.buffer)
                .resize({ width: 300 })
                .jpeg({ quality: 70 })
                .toFile(path.join(thumbDir, filename));
        }



        const product = await prisma.product.create({
            data: {
                price: parsedPrice,
                image: filename,
                translations: {
                    create: {
                        lang,
                        name,
                        description,
                    },
                },
            },
            include: {
                translations: {
                    where: { lang },
                    select: { name: true, description: true },
                },
            },
        });

        return {
            id: product.id,
            price: product.price,
            name: product.translations[0]?.name ?? '',
            description: product.translations[0]?.description ?? '',
            imageUrl: filename ? `/uploads/${filename}` : undefined,
        };
    }
}
