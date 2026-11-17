export type HapticPattern = 'tap' | 'toggle' | 'success' | 'warning';

const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  tap: 10,
  toggle: 14,
  success: [12, 30, 18],
  warning: [18, 24, 18],
};

let lastTriggeredAt = 0;

export function triggerHaptic(pattern: HapticPattern = 'tap'): void {
  lastTriggeredAt = Date.now();

  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return;
  }

  try {
    navigator.vibrate(HAPTIC_PATTERNS[pattern]);
  } catch {
    // Ignore errors on browsers/webviews that restrict Vibration API
  }
}

export function triggerFallbackTapHaptic(): void {
  if (Date.now() - lastTriggeredAt < 50) {
    return;
  }
  triggerHaptic('tap');
}
