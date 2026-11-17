import { useCallback, useEffect, useState } from 'react';

export type SoundEffect =
  | 'click'
  | 'toggle'
  | 'transition'
  | 'success'
  | 'alert'
  | 'slide';

let sharedSoundEnabled = false;
let audioCtx: AudioContext | null = null;
let lastSoundPlayedAt = 0;
const listeners = new Set<(enabled: boolean) => void>();

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextClass) return null;

  if (!audioCtx) {
    try {
      audioCtx = new AudioContextClass();
    } catch {
      return null;
    }
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {
      // Ignore autoplay restrictions before first user interaction
    });
  }

  return audioCtx;
}

function playTone(
  ctx: AudioContext,
  options: {
    startFreq: number;
    endFreq?: number;
    durationSec: number;
    gain: number;
    type?: OscillatorType;
    delaySec?: number;
  }
) {
  const now = ctx.currentTime + (options.delaySec ?? 0);
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();

  osc.type = options.type ?? 'triangle';
  osc.frequency.setValueAtTime(options.startFreq, now);
  if (options.endFreq !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(40, options.endFreq),
      now + options.durationSec
    );
  }

  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.linearRampToValueAtTime(options.gain, now + 0.004);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + options.durationSec);

  osc.connect(amp);
  amp.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + options.durationSec + 0.01);
}

export function triggerSound(effect: SoundEffect = 'click'): void {
  lastSoundPlayedAt = Date.now();
  if (!sharedSoundEnabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    switch (effect) {
      case 'click':
        playTone(ctx, {
          startFreq: 640,
          endFreq: 240,
          durationSec: 0.026,
          gain: 0.045,
          type: 'triangle',
        });
        break;
      case 'toggle':
        playTone(ctx, {
          startFreq: 420,
          endFreq: 590,
          durationSec: 0.038,
          gain: 0.05,
          type: 'sine',
        });
        break;
      case 'slide':
        playTone(ctx, {
          startFreq: 520,
          endFreq: 480,
          durationSec: 0.018,
          gain: 0.028,
          type: 'sine',
        });
        break;
      case 'transition':
        playTone(ctx, {
          startFreq: 392,
          endFreq: 523.25,
          durationSec: 0.085,
          gain: 0.036,
          type: 'sine',
        });
        break;
      case 'success':
        playTone(ctx, {
          startFreq: 523.25,
          endFreq: 554.37,
          durationSec: 0.085,
          gain: 0.05,
          type: 'triangle',
        });
        playTone(ctx, {
          startFreq: 659.25,
          endFreq: 783.99,
          durationSec: 0.13,
          gain: 0.055,
          type: 'triangle',
          delaySec: 0.06,
        });
        break;
      case 'alert':
        playTone(ctx, {
          startFreq: 340,
          endFreq: 220,
          durationSec: 0.075,
          gain: 0.055,
          type: 'triangle',
        });
        playTone(ctx, {
          startFreq: 260,
          endFreq: 180,
          durationSec: 0.08,
          gain: 0.045,
          type: 'triangle',
          delaySec: 0.065,
        });
        break;
    }
  } catch {
    // Ignore audio synthesis errors in restricted environments
  }
}

export function playFallbackTapSound(): void {
  if (Date.now() - lastSoundPlayedAt < 50) {
    return;
  }
  triggerSound('click');
}

export function setGlobalSoundEnabled(enabled: boolean): void {
  sharedSoundEnabled = enabled;
  listeners.forEach((listener) => listener(enabled));
  if (enabled) {
    triggerSound('toggle');
  }
}

export function useSoundFeedback() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sharedSoundEnabled);

  useEffect(() => {
    const sync = (enabled: boolean) => setSoundEnabled(enabled);
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);

  const playSound = useCallback((effect: SoundEffect = 'click') => {
    triggerSound(effect);
  }, []);

  const toggleSound = useCallback(() => {
    setGlobalSoundEnabled(!sharedSoundEnabled);
  }, []);

  return {
    soundEnabled,
    playSound,
    toggleSound,
  };
}
