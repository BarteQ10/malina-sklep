
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '../locales/en/common.json';
import plCommon from '../locales/pl/common.json';

const resources = {
    en: {
        common: enCommon,
    },
    pl: {
        common: plCommon,
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'pl',
    fallbackLng: 'pl',
    defaultNS: 'common',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;