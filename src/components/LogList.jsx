
import React from 'react';
import { useLogs } from '../store/LogContext';
import { Plus, Trash2, FileText, Mic, Image, Film } from 'lucide-react';
import ExportLogs from './ExportLogs';
import ImportLogs from './ImportLogs';
import SettingsModal from './SettingsModal';
import LanguageFlags from './LanguageFlags';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import './LogList.css';

const LogList = () => {
    const { logs, activeLogId, setActiveLogId, createLog, deleteLog, getDayNumber } = useLogs();
    const { t } = useTranslation();

    const getPreview = (log) => {
        if (log.content) {
            return log.content.slice(0, 50) + (log.content.length > 50 ? '...' : '');
        }

        const dayNum = getDayNumber(log);
        return t('logList.defaultLogTitle', { dayNum });
    };

    return (
        <div className="log-list-container">
            <div className="log-list-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h2 style={{ marginBottom: 0 }}>{t('common.appTitle')}</h2>
                        <LanguageFlags />
                    </div>
                    <ImportLogs variant="icon" />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-new" onClick={createLog}>
                        <Plus size={18} />
                        <span>{t('common.new')}</span>
                    </button>
                    <ExportLogs />
                    <SettingsModal />
                </div>
            </div>

            <div className="log-items">
                {logs.length === 0 && (
                    <div className="empty-state">
                        {t('logList.empty')}
                    </div>
                )}

                {logs.map(log => (
                    <div
                        key={log.id}
                        className={`log-item ${activeLogId === log.id ? 'active' : ''}`}
                        onClick={() => setActiveLogId(log.id)}
                    >
                        <div className="log-item-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="log-date">
                                    SD-{format(log.timestamp, 'yyMM.dd')}
                                </span>
                                {log.audio && <Mic size={12} color="var(--color-accent-primary)" />}
                                {log.images && log.images.length > 0 && <Image size={12} color="var(--color-accent-secondary)" />}
                                {log.videos && log.videos.length > 0 && <Film size={12} color="#ff4040" />}
                            </div>
                            <button
                                className="btn-delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(t('logList.confirmDelete'))) deleteLog(log.id);
                                }}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <div className="log-preview">
                            {getPreview(log)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LogList;
