import React, { useEffect, useRef } from 'react';
import { useLogs } from '../store/LogContext';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import AudioRecorder from './AudioRecorder';
import MediaManager from './MediaManager';
import './LogEditor.css';
import './AudioRecorder.css';
import './LogEditorControls.css';

const LogEditor = () => {
    const { activeLog, updateLog, setActiveLogId } = useLogs();
    const textareaRef = useRef(null);

    if (!activeLog) {
        return (
            <div className="editor-empty">
                <div className="empty-content">
                    <h1>USS ENTERPRISE</h1>
                    <p>SYSTEM READY</p>
                    <span className="blink">_</span>
                </div>
            </div>
        );
    }

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
                    <label>LOG ID</label>
                    <span>{activeLog.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="meta-group">
                    <label>STARDATE</label>
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
                placeholder="Begin log entry..."
                autoFocus
                spellCheck="false"
            />

            <div className="editor-footer">
                STATUS: RECORDING // WORDS: {activeLog.content.split(/\s+/).filter(Boolean).length}
            </div>
        </div>
    );
};

export default LogEditor;
