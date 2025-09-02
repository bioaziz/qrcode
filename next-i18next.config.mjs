import path from 'path';

const config = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr']
  },
  localePath: path.resolve('./public/locales')
};

export default config;
