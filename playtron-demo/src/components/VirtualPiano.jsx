import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMidi } from '../context/MidiContext';
import { audioEngine } from '../lib/audio';
import styles from './VirtualPiano.module.css';

// Simple range of keys for the demo (C3 to C5)
const NOTES = [
    { note: 'C3', isSharp: false },
    { note: 'C#3', isSharp: true },
    { note: 'D3', isSharp: false },
    { note: 'D#3', isSharp: true },
    { note: 'E3', isSharp: false },
    { note: 'F3', isSharp: false },
    { note: 'F#3', isSharp: true },
    { note: 'G3', isSharp: false },
    { note: 'G#3', isSharp: true },
    { note: 'A3', isSharp: false },
    { note: 'A#3', isSharp: true },
    { note: 'B3', isSharp: false },
    { note: 'C4', isSharp: false },
    { note: 'C#4', isSharp: true },
    { note: 'D4', isSharp: false },
    { note: 'D#4', isSharp: true },
    { note: 'E4', isSharp: false },
    { note: 'F4', isSharp: false },
    { note: 'F#4', isSharp: true },
    { note: 'G4', isSharp: false },
    { note: 'G#4', isSharp: true },
    { note: 'A4', isSharp: false },
    { note: 'A#4', isSharp: true },
    { note: 'B4', isSharp: false },
    { note: 'C5', isSharp: false },
];

const VirtualPiano = () => {
    const { lastNote } = useMidi();
    const [activeNotes, setActiveNotes] = useState(new Set());

    useEffect(() => {
        if (lastNote) {
            // Quick Map: 60 is C4. 48 is C3.
            const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            const octave = Math.floor(lastNote.note / 12) - 1;
            const noteIndex = lastNote.note % 12;
            const noteName = `${noteNames[noteIndex]}${octave}`;

            if (lastNote.type === 'on') {
                setActiveNotes(prev => new Set(prev).add(noteName));
                audioEngine.triggerAttack(noteName, lastNote.velocity / 127);
            } else {
                setActiveNotes(prev => {
                    const next = new Set(prev);
                    next.delete(noteName);
                    return next;
                });
                audioEngine.triggerRelease(noteName);
            }
        }
    }, [lastNote]);

    const handleMouseDown = (note) => {
        audioEngine.triggerAttack(note);
        setActiveNotes(prev => new Set(prev).add(note));
    };

    const handleMouseUp = (note) => {
        audioEngine.triggerRelease(note);
        setActiveNotes(prev => {
            const next = new Set(prev);
            next.delete(note);
            return next;
        });
    };

    return (
        <div className={styles.piano}>
            {NOTES.map((n) => (
                <motion.div
                    key={n.note}
                    className={`${styles.key} ${n.isSharp ? styles.blackKey : styles.whiteKey} ${activeNotes.has(n.note) ? styles.active : ''}`}
                    onMouseDown={() => handleMouseDown(n.note)}
                    onMouseUp={() => handleMouseUp(n.note)}
                    onMouseLeave={() => handleMouseUp(n.note)}
                    whileHover={{ scale: 0.98 }}
                    transition={{ duration: 0.1 }}
                >
                    <span className={styles.label}>{n.note}</span>
                </motion.div>
            ))}
        </div>
    );
};

export default VirtualPiano;
