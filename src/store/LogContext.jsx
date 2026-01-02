import React, { createContext, useContext, useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';

const LogContext = createContext();

export const useLogs = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  return context;
};

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeLogId, setActiveLogId] = useState(null);
  const [shipName, setShipName] = useState('USS ENTERPRISE');

  // Load logs and settings from IndexedDB on mount
  useEffect(() => {
    Promise.all([
      get('captains-logs'),
      get('ship-name')
    ]).then(([logsVal, shipNameVal]) => {
      if (logsVal) setLogs(logsVal);
      if (shipNameVal) setShipName(shipNameVal);
      setIsLoaded(true);
    });
  }, []);

  // Save logs to IndexedDB whenever they change, but only after initial load
  useEffect(() => {
    if (isLoaded) {
      set('captains-logs', logs);
    }
  }, [logs, isLoaded]);

  const setShipNameAndSave = (name) => {
    setShipName(name);
    set('ship-name', name);
  };

  const createLog = () => {
    const newLog = {
      id: crypto.randomUUID(),
      content: '',
      timestamp: Date.now(),
      lastModified: Date.now(),
    };
    setLogs([newLog, ...logs]);
    setActiveLogId(newLog.id);
  };

  const updateLog = (id, updates) => {
    setLogs(prevLogs =>
      prevLogs.map(log =>
        log.id === id
          ? { ...log, ...updates, lastModified: Date.now() }
          : log
      )
    );
  };

  const deleteLog = (id) => {
    setLogs(prevLogs => prevLogs.filter(log => log.id !== id));
    if (activeLogId === id) {
      setActiveLogId(null);
    }
  };

  const activeLog = logs.find(log => log.id === activeLogId) || null;

  return (
    <LogContext.Provider value={{
      logs,
      activeLogId,
      activeLog,
      shipName,
      setShipName: setShipNameAndSave,
      setActiveLogId,
      createLog,
      updateLog,
      deleteLog,
      isLoaded
    }}>
      {children}
    </LogContext.Provider>
  );
};
