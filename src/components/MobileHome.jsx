import React from 'react';
import { useLogs } from '../store/LogContext';
import { Plus, List, Coffee } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageFlags from './LanguageFlags';
import './MobileHome.css';

const MobileHome = ({ onViewLogs }) => {
    const { shipName, createLog } = useLogs();
    const { t } = useTranslation();

    return (
        <div className="mobile-home">
            <div className="mobile-content">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <h1 className="app-title" style={{ margin: 0 }}>{t('common.appTitle')}</h1>
                    <LanguageFlags />
                </div>
                <h2 className="ship-name">{shipName}</h2>
                <p>{t('home.systemReady')}</p>
                <span className="blink">_</span>
            </div>
            <div className="mobile-actions">
                <button onClick={createLog} className="btn-mobile-action btn-new-large">
                    <Plus />
                    <span>{t('home.newLogEntry')}</span>
                </button>
                <button onClick={onViewLogs} className="btn-mobile-action btn-view-logs">
                    <List />
                    <span>{t('home.viewLogHistory')}</span>
                </button>
                <a
                    href="https://www.buymeacoffee.com/qhuang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-mobile-action btn-support"
                >
                    <Coffee />
                    <span>{t('home.buyMeACoffee')}</span>
                </a>
            </div>
        </div>
    )
}

export default MobileHome;
