/// <reference types="node" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Wyczyść istniejące dane (opcjonalnie na potrzeby developmentu)
    await prisma.productTranslation.deleteMany();
    await prisma.product.deleteMany();

    const products = await Promise.all([
        prisma.product.create({
            data: {
                price: 12.5,
                translations: {
                    create: [
                        { lang: 'pl', name: 'Maliny świeże', description: 'Świeże maliny z ekologicznych upraw.' },
                        { lang: 'en', name: 'Fresh raspberries', description: 'Fresh raspberries from organic farms.' }
                    ]
                }
            }
        }),
        prisma.product.create({
            data: {
                price: 8.99,
                translations: {
                    create: [
                        { lang: 'pl', name: 'Dżem malinowy', description: 'Słodki domowy dżem malinowy.' },
                        { lang: 'en', name: 'Raspberry jam', description: 'Sweet homemade raspberry jam.' }
                    ]
                }
            }
        }),
        prisma.product.create({
            data: {
                price: 5.49,
                translations: {
                    create: [
                        { lang: 'pl', name: 'Herbata malinowa', description: 'Aromatyczna herbata o smaku malinowym.' },
                        { lang: 'en', name: 'Raspberry tea', description: 'Aromatic tea with raspberry flavor.' }
                    ]
                }
            }
        }),
    ]);

    console.log(`Seed completed: ${products.length} products created.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
