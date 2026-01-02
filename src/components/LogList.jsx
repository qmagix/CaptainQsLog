
import React from 'react';
import { useLogs } from '../store/LogContext';
import { Plus, Trash2, FileText, Mic, Image, Film } from 'lucide-react';
import ExportLogs from './ExportLogs';
import SettingsModal from './SettingsModal';
import { format } from 'date-fns';
import './LogList.css';

const LogList = () => {
    const { logs, activeLogId, setActiveLogId, createLog, deleteLog, getDayNumber } = useLogs();

    const getPreview = (log) => {
        if (log.content) {
            return log.content.slice(0, 50) + (log.content.length > 50 ? '...' : '');
        }

        const dayNum = getDayNumber(log);
        return `Captain's Log, Day ${dayNum}`;
    };

    return (
        <div className="log-list-container">
            <div className="log-list-header">
                <h2>CAPTAIN'S LOG</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-new" onClick={createLog}>
                        <Plus size={18} />
                        <span>NEW</span>
                    </button>
                    <ExportLogs />
                    <SettingsModal />
                </div>
            </div>

            <div className="log-items">
                {logs.length === 0 && (
                    <div className="empty-state">
                        No logs found. Initialize new entry.
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
                                    if (window.confirm('Delete this log entry?')) deleteLog(log.id);
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
