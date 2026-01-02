import React, { createContext, useContext, useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import { format } from 'date-fns';

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

  const logDayMap = React.useMemo(() => {
    const getDateString = (timestamp) => format(timestamp, 'yyyy-MM-dd');
    const sortedLogs = [...logs].sort((a, b) => a.timestamp - b.timestamp);
    const uniqueDays = new Set();
    sortedLogs.forEach(log => {
      uniqueDays.add(getDateString(log.timestamp));
    });
    const sortedDays = Array.from(uniqueDays).sort();
    const dayIndexMap = {};
    sortedDays.forEach((dateStr, index) => {
      dayIndexMap[dateStr] = index + 1;
    });
    return dayIndexMap;
  }, [logs]);

  const getDayNumber = (log) => {
    if (!log) return 0;
    const dateStr = format(log.timestamp, 'yyyy-MM-dd');
    return logDayMap[dateStr] || 1;
  };

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
      isLoaded,
      getDayNumber
    }}>
      {children}
    </LogContext.Provider>
  );
};
