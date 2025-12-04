import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../i18n/translations';

export const useTranslation = () => {
  const { language, setLanguage } = useLanguage();
  
  const translate = (key) => {
    const keys = key.split('.');
    let value = t[language];
    for (const k of keys) {
      if (value?.[k]) value = value[k];
      else return key;
    }
    return value || key;
  };
  
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };
  
  return { t: translate, language, changeLanguage };
};
