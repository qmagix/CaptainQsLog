import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageFlags.css';

const LanguageFlags = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="language-flags">
            <button
                className={`btn-flag ${i18n.language === 'en' ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); changeLanguage('en'); }}
                title="English"
            >
                🇺🇸
            </button>
            <button
                className={`btn-flag ${i18n.language === 'zh' ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); changeLanguage('zh'); }}
                title="中文"
            >
                🇨🇳
            </button>
        </div>
    );
};

export default LanguageFlags;
