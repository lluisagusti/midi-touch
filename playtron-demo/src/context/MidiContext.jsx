import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const MidiContext = createContext({
  isEnabled: false,
  inputs: [],
  lastNote: null,
  error: null,
});

export const useMidi = () => useContext(MidiContext);

export const MidiProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [inputs, setInputs] = useState([]);
  const [lastNote, setLastNote] = useState(null);
  const [error, setError] = useState(null);

  const handleMidiMessage = useCallback((message) => {
    const [command, note, velocity] = message.data;
    
    // Note On (144) or Note Off (128)
    if (command === 144 && velocity > 0) {
      setLastNote({ note, velocity, type: 'on', timestamp: Date.now() });
    } else if (command === 128 || (command === 144 && velocity === 0)) {
        setLastNote({ note, velocity: 0, type: 'off', timestamp: Date.now() });
    }
  }, []);

  const onStateChange = useCallback((access) => {
      const inputsArr = Array.from(access.inputs.values());
      setInputs(inputsArr);
      console.log('MIDI State Changed:', inputsArr);
      
      // Re-bind listeners if new devices serve
      inputsArr.forEach(input => {
          input.onmidimessage = handleMidiMessage;
      });
  }, [handleMidiMessage]);


  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      setError('Web MIDI API is not supported in this browser.');
      return;
    }

    navigator.requestMIDIAccess()
      .then((access) => {
        setIsEnabled(true);
        const inputsArr = Array.from(access.inputs.values());
        setInputs(inputsArr);

        // Attach listeners
        inputsArr.forEach(input => {
          input.onmidimessage = handleMidiMessage;
        });

        access.onstatechange = () => onStateChange(access);
      })
      .catch((err) => {
        console.error('MIDI Access Failed:', err);
        setError('Failed to access MIDI devices. Check permissions.');
      });
  }, [handleMidiMessage, onStateChange]);

  return (
    <MidiContext.Provider value={{ isEnabled, inputs, lastNote, error }}>
      {children}
    </MidiContext.Provider>
  );
};
