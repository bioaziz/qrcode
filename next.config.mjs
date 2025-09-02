import nextI18NextConfig from './next-i18next.config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  ...nextI18NextConfig,
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",

};

export default nextConfig;
