# FXE (FX Engine)

A TypeScript library for synchronizing functions and animations with a beat. FXE provides utilities to create rhythm-based effects, animations, and visualizations that stay in sync with a BPM (beats per minute) clock.

## Overview

FXE is designed for creative coding, audio-visual applications, and music visualizers where timing animations and effects to a musical beat is essential. It leverages Three.js Clock for precise time management and offers a suite of interpolation and timing functions.

## Features

- **BPM Synchronization**: Execute functions and animate values in sync with a configurable BPM
- **Multiple Interpolation Methods**:
  - Linear BPM interpolation with optional easing functions
  - Wave-based interpolation (cosine) for smooth oscillations
  - MIDI value interpolation (0-127 range)
  - Percentage-based interpolation
- **Strobe Effects**: Toggle between values based on beat timing
- **Array Value Selection**: Pick values from arrays based on beat position
- **Flexible Timing Controls**:
  - Offset support for phase-shifted animations
  - Beat measure multipliers (e.g., trigger every 2 beats, or twice per beat)
  - Optional looping control
  - Custom easing functions

## Installation

```bash
npm install @aandrek/fxe
```

## Usage

```typescript
import Fxengine from '@aandrek/fxe';
import { Clock } from 'three';

// Create a clock and initialize FXE with a BPM
const clock = new Clock();
const fxe = new Fxengine(clock, 120); // 120 BPM

// Call a function once per beat
fxe.fxBPMCallFn(() => {
  console.log('Beat!');
}, 0, 1);

// Interpolate a value based on BPM (e.g., for animation)
const animatedValue = fxe.fxBPMInterpolation(
  0,      // min value
  100,    // max value
  0,      // offset
  1       // beat measure
);

// Create a wave effect
const waveValue = fxe.fxBPMWaveInterpolation(0, 360, 0, 1);

// Strobe between two values
const strobeColor = fxe.fxStrobe('#ff0000', '#0000ff', 0, 1);
```

## API Reference

### Constructor

```typescript
new Fxengine(clock: Clock, bpm: number)
```

### Main Methods

- **`fxBPMCallFn(fn, offsetPercentage, beatMeasure)`**: Execute a function in sync with the beat
- **`fxBPMInterpolation(minValue, maxValue, fxOffsetSeed, beatMeasure, easingFn, loop)`**: Interpolate between values based on BPM timing
- **`fxBPMWaveInterpolation(minValue, maxValue, fxOffsetSeed, beatMeasure, easingFn)`**: Create wave-based interpolations
- **`fxStrobe(value1, value2, fxOffset, beatMeasure)`**: Toggle between two values
- **`fxBPMArrayValue(valueArray, fxOffset, beatMeasure)`**: Select values from an array based on beat position
- **`fxMidiInterpolation(minValue, maxValue, midiValue)`**: Convert MIDI values (0-127) to custom ranges
- **`fxPercentInterpolation(minValue, maxValue, percent)`**: Interpolate based on percentage (0-1)

### Properties

- **`bpm`**: Beats per minute
- **`clock`**: Three.js Clock instance
- **`effectWindow`**: Duration of one beat in seconds

## Use Cases

- Music visualizers
- VJ software and live visuals
- Rhythm games
- Audio-reactive animations
- Creative coding projects
- Real-time audio-visual performances

## License

ISC

## Author

aandrek - [aa.ndrek.com](https://aa.ndrek.com)

## Repository

[https://github.com/aandrek/fxe](https://github.com/aandrek/fxe)