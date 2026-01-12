import React, { useRef } from 'react';
import { useLogs } from '../store/LogContext';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import AudioRecorder from './AudioRecorder';
import MediaManager from './MediaManager';
import { useTranslation } from 'react-i18next';
import './LogEditor.css';
import './AudioRecorder.css';
import './LogEditorControls.css';

const LogEditor = () => {
    const { activeLog, updateLog, setActiveLogId, shipName, getDayNumber } = useLogs();
    const { t } = useTranslation();
    const textareaRef = useRef(null);

    if (!activeLog) {
        return (
            <div className="editor-empty">
                <div className="empty-content">
                    <h1>{shipName}</h1>
                    <p>{t('home.systemReady')}</p>
                    <span className="blink">_</span>
                </div>
            </div>
        );
    }

    const dayNum = getDayNumber(activeLog);
    const placeholderText = `${t('editor.placeholderHeader', { dayNum })}

${t('editor.placeholderMission')}

${t('editor.placeholderEvents')}

${t('editor.placeholderMorale')}

${t('editor.placeholderNotes')}`;

    return (
        <div className="editor-container">
            <div className="editor-header">
                <button
                    className="btn-back"
                    onClick={() => setActiveLogId(null)}
                >
                    <ArrowLeft size={18} />
                </button>
                <div className="meta-group">
                    <label>{t('editor.vessel')}</label>
                    <span>{shipName}</span>
                </div>
                <div className="meta-group">
                    <label>{t('editor.logId')}</label>
                    <span>{activeLog.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="meta-group">
                    <label>{t('editor.stardate')}</label>
                    <span>{format(activeLog.timestamp, 'yyyy.MM.dd.HH:mm')}</span>
                </div>
            </div>

            <div className="editor-controls">
                <MediaManager
                    images={activeLog.images}
                    videos={activeLog.videos}
                    onUpdate={(updates) => updateLog(activeLog.id, updates)}
                />

                <AudioRecorder
                    audioData={activeLog.audio}
                    onSave={(audioBase64) => updateLog(activeLog.id, { audio: audioBase64 })}
                    onDelete={() => updateLog(activeLog.id, { audio: null })}
                />
            </div>

            <textarea
                ref={textareaRef}
                className="log-textarea"
                value={activeLog.content}
                onChange={(e) => updateLog(activeLog.id, { content: e.target.value })}
                placeholder={placeholderText}
                autoFocus
                spellCheck="false"
            />

            <div className="editor-footer">
                {t('editor.status', { count: activeLog.content ? activeLog.content.split(/\s+/).filter(Boolean).length : 0 })}
            </div>
        </div>
    );
};

export default LogEditor;
