import { useState } from 'react';
import { Zap } from 'lucide-react';
import { SkillPicker } from './components/SkillPicker';
import { PromptBuilder } from './components/PromptBuilder';
import { SettingsModal } from './components/SettingsModal';
import './App.css';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon-wrapper">
            <div className="brand-icon">
              <Zap size={24} fill="white" />
            </div>
          </div>
          <div className="brand-info">
            <h1 className="brand-title">
              <span className="gradient-text">Superpowers</span>
            </h1>

          </div>
        </div>


      </header>

      <main className="app-main">
        <PromptBuilder onOpenSettings={() => setSettingsOpen(true)} />
        <SkillPicker />
      </main>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
