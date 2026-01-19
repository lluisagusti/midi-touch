import React from 'react';
import * as Tone from 'tone';
import { motion } from 'framer-motion';
import styles from './SampleGrid.module.css';

const DRUMS = [
    { id: 'kick', label: 'KICK', color: '#ec4899' },
    { id: 'snare', label: 'SNARE', color: '#8b5cf6' },
    { id: 'hihat', label: 'HI-HAT', color: '#10b981' },
    { id: 'clap', label: 'CLAP', color: '#f59e0b' },
];

const SampleGrid = () => {
    // We'll create synths on the fly or in a useEffect for better performance
    // For demo simplicity, let's create them here or use a helper
    // Ideally these should be in AudioEngine

    const playSound = (type) => {
        // Simple synth drums
        switch (type) {
            case 'kick': {
                const kick = new Tone.MembraneSynth().toDestination();
                kick.triggerAttackRelease("C2", "8n");
                break;
            }
            case 'snare': {
                const snare = new Tone.NoiseSynth({
                    noise: { type: 'white' },
                    envelope: { attack: 0.005, decay: 0.1, sustain: 0 }
                }).toDestination();
                snare.triggerAttackRelease("8n");
                break;
            }
            case 'hihat': {
                const hat = new Tone.MetalSynth({
                    frequency: 200,
                    envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
                    harmonicity: 5.1,
                    modulationIndex: 32,
                    resonance: 4000,
                    octaves: 1.5
                }).toDestination();
                hat.triggerAttackRelease("32n");
                break;
            }
            case 'clap': {
                const clap = new Tone.NoiseSynth({
                    noise: { type: 'pink' },
                    envelope: { attack: 0.005, decay: 0.1, sustain: 0 }
                }).toDestination();
                clap.triggerAttackRelease("16n");
                break;
            }
            default:
                break;
        }
    };

    return (
        <div className={styles.grid}>
            {DRUMS.map((drum) => (
                <motion.button
                    key={drum.id}
                    className={styles.pad}
                    style={{ borderColor: drum.color, color: drum.color }}
                    whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${drum.color}40` }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => playSound(drum.id)}
                >
                    {drum.label}
                </motion.button>
            ))}
        </div>
    );
};

export default SampleGrid;
