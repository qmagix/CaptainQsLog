import React from 'react';
import { useLogs } from '../store/LogContext';
import { Plus, List } from 'lucide-react';
import './MobileHome.css';

const MobileHome = ({ onViewLogs }) => {
    const { shipName, createLog } = useLogs();

    return (
        <div className="mobile-home">
            <div className="mobile-content">
                <h1 className="app-title">CAPTAIN'S LOG</h1>
                <h2 className="ship-name">{shipName}</h2>
                <p>SYSTEM READY</p>
                <span className="blink">_</span>
            </div>
            <div className="mobile-actions">
                <button onClick={createLog} className="btn-mobile-action btn-new-large">
                    <Plus />
                    <span>NEW LOG ENTRY</span>
                </button>
                <button onClick={onViewLogs} className="btn-mobile-action btn-view-logs">
                    <List />
                    <span>VIEW LOG HISTORY</span>
                </button>
            </div>
        </div>
    )
}

export default MobileHome;
