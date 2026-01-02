import React, { useState } from 'react';
import { useLogs } from '../store/LogContext';
import { Settings, X, Save } from 'lucide-react';
import './SettingsModal.css';

const SettingsModal = () => {
    const { shipName, setShipName } = useLogs();
    const [isOpen, setIsOpen] = useState(false);
    const [tempName, setTempName] = useState(shipName);

    const handleOpen = () => {
        setTempName(shipName);
        setIsOpen(true);
    };

    const handleSave = () => {
        setShipName(tempName);
        setIsOpen(false);
    };

    return (
        <>
            <button className="btn-settings" onClick={handleOpen} title="Configure Ship Profile">
                <Settings size={18} />
            </button>

            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>SHIP PROFILE</h3>
                            <button className="btn-close" onClick={() => setIsOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="input-group">
                                <label>VESSEL REGISTRY NAME</label>
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    placeholder="e.g. USS ENTERPRISE"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-save" onClick={handleSave}>
                                <Save size={16} />
                                <span>UPDATE REGISTRY</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SettingsModal;
