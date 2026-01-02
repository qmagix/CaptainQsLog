import React, { useState } from 'react';
import { LogProvider, useLogs } from './store/LogContext';
import LogList from './components/LogList';
import LogEditor from './components/LogEditor';
import MobileHome from './components/MobileHome';
import './App.css';

const MainLayout = () => {
  const { activeLogId } = useLogs();
  const [mobileMode, setMobileMode] = useState('HOME');

  const getViewClass = () => {
    if (activeLogId) return 'mobile-view-editor';
    if (mobileMode === 'LIST') return 'mobile-view-list';
    return 'mobile-view-home';
  };

  return (
    <div className={`app-container ${getViewClass()}`}>
      <div className="mobile-only-home">
        <MobileHome onViewLogs={() => setMobileMode('LIST')} />
      </div>
      <LogList />
      <LogEditor />
    </div>
  );
};

function App() {
  return (
    <LogProvider>
      <MainLayout />
    </LogProvider>
  );
}

export default App;
