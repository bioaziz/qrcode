const { Translate } = require('@google-cloud/translate').v2;

const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
if (!apiKey) {
  console.error('GOOGLE_TRANSLATE_API_KEY env var is required');
  process.exit(1);
}

const translate = new Translate({ key: apiKey });
