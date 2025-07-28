const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(cors());

const products = {
    pl: [
        { id: 1, name: 'Maliny świeże', price: 12.5, description: 'Świeże maliny z ekologicznych upraw.' },
        { id: 2, name: 'Dżem malinowy', price: 8.99, description: 'Słodki domowy dżem malinowy.' },
        { id: 3, name: 'Herbata malinowa', price: 5.49, description: 'Aromatyczna herbata o smaku malinowym.' },
    ],
    en: [
        { id: 1, name: 'Fresh raspberries', price: 12.5, description: 'Fresh raspberries from organic farms.' },
        { id: 2, name: 'Raspberry jam', price: 8.99, description: 'Sweet homemade raspberry jam.' },
        { id: 3, name: 'Raspberry tea', price: 5.49, description: 'Aromatic tea with raspberry flavor.' },
    ]
};

app.get('/products/:lang', (req, res) => {
    const lang = req.params.lang;
    if (products[lang]) {
        res.json(products[lang]);
    } else {
        res.status(404).json({ error: 'Language not supported. Available: pl, en' });
    }
});

app.get('/products', (req, res) => {
    res.json(products['en']);
});

app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
});