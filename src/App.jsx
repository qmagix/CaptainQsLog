import React from 'react';
import { LogProvider, useLogs } from './store/LogContext';
import LogList from './components/LogList';
import LogEditor from './components/LogEditor';
import './App.css';

const MainLayout = () => {
  const { activeLogId } = useLogs();

  return (
    <div className={`app-container ${activeLogId ? 'mobile-view-editor' : 'mobile-view-list'}`}>
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
