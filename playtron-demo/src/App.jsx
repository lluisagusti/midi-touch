import React, { useState } from 'react';
import { MidiProvider, useMidi } from './context/MidiContext';
import { audioEngine } from './lib/audio';
import VirtualPiano from './components/VirtualPiano';
import SampleGrid from './components/SampleGrid';
import { ExternalLink, AlertCircle, Terminal, Play, Piano } from 'lucide-react';
import styles from './App.module.css';

const MidiMonitor = () => {
  const { inputs, error } = useMidi();
  const [audioStarted, setAudioStarted] = useState(false);

  const handleStart = async () => {
    await audioEngine.initialize();
    setAudioStarted(true);
  };

  return (
    <div className={styles.monitor}>
      <div className={styles.header}>
        <h1>Playtron <span style={{ fontWeight: 300, opacity: 0.7 }}>Touch</span></h1>
        <div className={styles.status}>
          {inputs.length > 0 ? (
            <span className={styles.connected}>
              <Terminal size={14} /> Playtron Detected ({inputs.length})
            </span>
          ) : (
            <span className={styles.disconnected}>
              <AlertCircle size={14} /> Connect Playtron
            </span>
          )}
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {!audioStarted ? (
        <button
          className={styles.startButton}
          onClick={handleStart}
        >
          <Play size={16} style={{ marginRight: 8 }} /> Start Experience
        </button>
      ) : (
        <div className={styles.workspace}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}><Piano size={18} /> Synths</h2>
            <VirtualPiano />
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Samples</h2>
            <SampleGrid />
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <p>Designed by Lluís Agustí using Tone.js For Playtronica.</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <MidiProvider>
      <MidiMonitor />
    </MidiProvider>
  );
}

export default App;
