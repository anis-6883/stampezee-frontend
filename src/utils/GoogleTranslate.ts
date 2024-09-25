import axios from 'axios';

const API_KEY = 'AIzaSyA0VpTwpD1F3VWNpyKWT84EQHqTYraMyC4';
const API_URL = 'https://translation.googleapis.com/language/translate/v2';

const translateText = async (text: string[], targetLanguage: string, sourceLanguage: string) => {
  const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
    q: text,
    target: targetLanguage,
    source: sourceLanguage ?? 'en',
  });

  return response.data.data.translations.map((translation: any) => translation.translatedText);
};

const translateData = async (data: any, targetLanguage: string, sourceLanguage: string) => {
  for (const item of data) {
    // Translate title
    const translatedTitle = await translateText([item.title], targetLanguage, sourceLanguage);
    item.title = translatedTitle[0];

    // Translate descriptions
    const translatedDescriptions = await translateText(item.descriptions, targetLanguage, sourceLanguage);
    item.descriptions = translatedDescriptions;
  }

  return data;
};

const faqTranslateData = async (data: any[], targetLanguage: string, sourceLanguage: string) => {
  return Promise.all(
    data.map(async (item) => {
      // Translate title
      const translatedTitle = await translateText([item.title], targetLanguage, sourceLanguage);

      // Translate description
      const translatedDescription = await translateText([item.description], targetLanguage, sourceLanguage);

      // Return a new object with translated properties
      return {
        ...item,
        title: translatedTitle[0],
        description: translatedDescription[0],
      };
    })
  );
};

export { faqTranslateData, translateData, translateText };
