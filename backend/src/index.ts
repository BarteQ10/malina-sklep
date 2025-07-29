import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = process.env.PORT || 4000;
const prisma = new PrismaClient();

app.use(cors());

app.get('/products/:lang', async (req, res) => {
  const lang = req.params.lang;
  if (!['pl', 'en'].includes(lang)) {
    return res.status(400).json({ error: 'Invalid language. Use "pl" or "en".' });
  }

  try {
    const products = await prisma.product.findMany({
      include: {
        translations: {
          where: { lang },
          select: {
            name: true,
            description: true,
          },
        },
      },
    });

    type ProductWithTranslations = typeof products[number];

    const translatedProducts = products.map((p: ProductWithTranslations) => ({
      id: p.id,
      price: p.price,
      name: p.translations[0]?.name ?? 'No name',
      description: p.translations[0]?.description ?? '',
    }));

    res.json(translatedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
