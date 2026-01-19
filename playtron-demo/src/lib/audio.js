import * as Tone from 'tone';

class AudioEngine {
    constructor() {
        this.synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: {
                type: "triangle"
            },
            envelope: {
                attack: 0.005,
                decay: 0.1,
                sustain: 0.3,
                release: 1
            }
        }).toDestination();

        // Add some effects for richness
        this.reverb = new Tone.Reverb({
            decay: 2.5,
            wet: 0.3
        }).toDestination();

        this.synth.connect(this.reverb);

        this.isReady = false;
    }

    async initialize() {
        if (this.isReady) return;
        await Tone.start();
        this.isReady = true;
        console.log('Audio Engine Interacted and Ready');
    }

    triggerAttack(note, velocity = 1) {
        if (!this.isReady) return;
        this.synth.triggerAttack(note, Tone.now(), velocity);
    }

    triggerRelease(note) {
        if (!this.isReady) return;
        this.synth.triggerRelease(note);
    }
}

export const audioEngine = new AudioEngine();
