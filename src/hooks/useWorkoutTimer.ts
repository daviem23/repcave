import { useState, useEffect, useRef, useCallback } from 'react';

export type TimerState = 'preroll' | 'exercising' | 'resting' | 'paused' | 'complete';

interface TimerConfig {
  prerollDuration: number;
  exerciseDuration?: number;
  restDuration: number;
}

interface UseWorkoutTimerProps {
  config: TimerConfig;
  onStateChange?: (state: TimerState) => void;
  onTimerComplete?: () => void;
}

export const useWorkoutTimer = ({ config, onStateChange, onTimerComplete }: UseWorkoutTimerProps) => {
  const [state, setState] = useState<TimerState>('preroll');
  const [timeRemaining, setTimeRemaining] = useState(config.prerollDuration);
  const [isActive, setIsActive] = useState(false);
  const [previousState, setPreviousState] = useState<TimerState>('preroll');
  const intervalRef = useRef<number | undefined>();

  const playSound = useCallback((soundType: TimerState) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    const createBeep = (frequency: number, duration: number, volume: number = 0.3) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    };

    switch (soundType) {
      case 'preroll':
        createBeep(800, 0.2);
        break;
      case 'exercising':
        createBeep(600, 0.15);
        setTimeout(() => createBeep(600, 0.15), 200);
        break;
      case 'resting':
        createBeep(400, 0.3);
        break;
      case 'complete':
        createBeep(523, 0.2);
        setTimeout(() => createBeep(659, 0.2), 200);
        setTimeout(() => createBeep(784, 0.4), 400);
        break;
    }
  }, []);

  const changeState = useCallback(
    (newState: TimerState) => {
      setPreviousState(state);
      setState(newState);
      playSound(newState);
      onStateChange?.(newState);
    },
    [state, playSound, onStateChange]
  );

  const startTimer = useCallback(() => {
    setIsActive(true);
    if (state === 'preroll') {
      changeState('preroll');
    }
  }, [state, changeState]);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
    setPreviousState(state);
    setState('paused');
    clearInterval(intervalRef.current);
  }, [state]);

  const resumeTimer = useCallback(() => {
    setIsActive(true);
    setState(previousState);
  }, [previousState]);

  const startExercise = useCallback(
    (duration?: number) => {
      setTimeRemaining(duration ?? 45); // fallback to 45s
      changeState('exercising');
      setIsActive(true);
    },
    [changeState]
  );

  const startRest = useCallback(() => {
    setTimeRemaining(config.restDuration);
    changeState('resting');
    setIsActive(true);
  }, [config.restDuration, changeState]);

  const completeWorkout = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setTimeRemaining(0);
    setState('complete');
    // Play completion sound without triggering onTimerComplete callback
    playSound('complete');
  }, [changeState, onTimerComplete]);

  const skipCurrentTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    if (state === 'preroll') {
      startExercise(config.exerciseDuration);
    } else if (state === 'resting' || state === 'exercising') {
      setIsActive(false);
      onTimerComplete?.();
    }
  }, [state, config.exerciseDuration, startExercise, onTimerComplete]);

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setState('preroll');
    setPreviousState('preroll');
    setTimeRemaining(config.prerollDuration);
  }, [config.prerollDuration]);

  useEffect(() => {
    clearInterval(intervalRef.current);

    if (!isActive || timeRemaining <= 0) return;

    intervalRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsActive(false);

          if (state === 'preroll') {
            setTimeout(() => startExercise(config.exerciseDuration), 100);
          } else if (state === 'resting') {
            setTimeout(() => onTimerComplete?.(), 100);
          } else if (state === 'exercising' && config.exerciseDuration) {
            setTimeout(() => startRest(), 100);
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeRemaining, state, config.exerciseDuration, startExercise, startRest, onTimerComplete]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    state,
    timeRemaining,
    isActive,
    formatTime: formatTime(timeRemaining),
    startTimer,
    pauseTimer,
    resumeTimer,
    startExercise,
    startRest,
    completeWorkout,
    skipCurrentTimer,
    resetTimer,
  };
};