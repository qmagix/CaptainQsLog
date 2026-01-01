import React from 'react';
import { LogProvider } from './store/LogContext';
import LogList from './components/LogList';
import LogEditor from './components/LogEditor';
import './App.css';

function App() {
  return (
    <LogProvider>
      <div className="app-container">
        <LogList />
        <LogEditor />
      </div>
    </LogProvider>
  );
}

export default App;
