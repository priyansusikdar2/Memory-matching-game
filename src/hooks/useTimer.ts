import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

interface UseTimerOptions {
  autoStart?: boolean;
  initialTime?: number;
  onTimeUpdate?: (time: number) => void;
  onTimeEnd?: () => void;
  timeLimit?: number;
}

interface UseTimerReturn {
  timeElapsed: number;
  isRunning: boolean;
  isPaused: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (newTime?: number) => void;
  stopTimer: () => void;
  setTime: (time: number) => void;
  formatTime: (format?: 'full' | 'minutes' | 'seconds') => string;
  getProgress: () => number;
}

export const useTimer = (
  isActive: boolean,
  options: UseTimerOptions = {}
): UseTimerReturn => {
  const {
    autoStart = true,
    initialTime = 0,
    onTimeUpdate,
    onTimeEnd,
    timeLimit
  } = options;

  const [timeElapsed, setTimeElapsed] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart && isActive);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef<number>(initialTime);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);

  // Define stopTimer first (before it's used in other functions)
  const stopTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Define startTimer
  const startTimer = useCallback(() => {
    if (!isActive) return;
    
    setIsRunning(true);
    setIsPaused(false);
    startTimeRef.current = null;
    accumulatedTimeRef.current = timeElapsed * 1000;
    lastTimestampRef.current = 0;
  }, [isActive, timeElapsed]);

  // Define pauseTimer
  const pauseTimer = useCallback(() => {
    setIsPaused(true);
    setIsRunning(false);
    
    // Store accumulated time
    if (startTimeRef.current && lastTimestampRef.current) {
      const additionalTime = lastTimestampRef.current - startTimeRef.current;
      accumulatedTimeRef.current += additionalTime;
    }
  }, []);

  // Define resetTimer
  const resetTimer = useCallback((newTime?: number) => {
    const resetValue = newTime ?? initialTime;
    setTimeElapsed(resetValue);
    accumulatedTimeRef.current = resetValue * 1000;
    startTimeRef.current = null;
    lastTimestampRef.current = 0;
    setIsRunning(autoStart && isActive);
    setIsPaused(false);
    onTimeUpdate?.(resetValue);
  }, [initialTime, autoStart, isActive, onTimeUpdate]);

  // Define setTime
  const setTime = useCallback((time: number) => {
    if (time >= 0) {
      setTimeElapsed(time);
      accumulatedTimeRef.current = time * 1000;
      onTimeUpdate?.(time);
    }
  }, [onTimeUpdate]);

  // Define formatTime
  const formatTime = useCallback((format: 'full' | 'minutes' | 'seconds' = 'full'): string => {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    switch (format) {
      case 'seconds':
        return timeElapsed.toString();
      case 'minutes':
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      case 'full':
      default:
        if (hours > 0) {
          return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }, [timeElapsed]);

  // Define getProgress
  const getProgress = useCallback((): number => {
    if (!timeLimit) return 0;
    return Math.min(100, (timeElapsed / timeLimit) * 100);
  }, [timeElapsed, timeLimit]);

  // High-precision timer using requestAnimationFrame
  const startHighPrecisionTimer = useCallback(() => {
    if (!isActive || !isRunning || isPaused) return;

    const updateTime = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
        lastTimestampRef.current = timestamp;
        animationFrameRef.current = requestAnimationFrame(updateTime);
        return;
      }

      const deltaTime = timestamp - lastTimestampRef.current;
      
      // Only update if enough time has passed (throttle to 60fps)
      if (deltaTime >= 16.67) {
        const elapsed = accumulatedTimeRef.current + (timestamp - startTimeRef.current);
        const newTime = Math.floor(elapsed / 1000);
        
        if (newTime !== timeElapsed) {
          setTimeElapsed(newTime);
          onTimeUpdate?.(newTime);
          
          // Check time limit
          if (timeLimit && newTime >= timeLimit) {
            stopTimer();
            onTimeEnd?.();
          }
        }
        
        lastTimestampRef.current = timestamp;
      }
      
      animationFrameRef.current = requestAnimationFrame(updateTime);
    };

    animationFrameRef.current = requestAnimationFrame(updateTime);
  }, [isActive, isRunning, isPaused, timeElapsed, onTimeUpdate, timeLimit, onTimeEnd, stopTimer]);

  // Fallback timer using setInterval (for background tabs)
  const startFallbackTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      if (isActive && isRunning && !isPaused) {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          onTimeUpdate?.(newTime);
          
          if (timeLimit && newTime >= timeLimit) {
            stopTimer();
            onTimeEnd?.();
          }
          
          return newTime;
        });
      }
    }, 1000);
  }, [isActive, isRunning, isPaused, onTimeUpdate, timeLimit, onTimeEnd, stopTimer]);

  // Choose timer implementation based on page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Use fallback timer when tab is not visible
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        startFallbackTimer();
      } else {
        // Use high-precision timer when tab is visible
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        startHighPrecisionTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Start with high-precision timer
    if (isActive && isRunning && !isPaused) {
      startHighPrecisionTimer();
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isRunning, isPaused, startHighPrecisionTimer, startFallbackTimer]);

  // Update timer when isActive changes
  useEffect(() => {
    if (isActive && isRunning && !isPaused) {
      if (document.hidden) {
        startFallbackTimer();
      } else {
        startHighPrecisionTimer();
      }
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isActive, isRunning, isPaused, startHighPrecisionTimer, startFallbackTimer]);

  return useMemo(() => ({
    timeElapsed,
    isRunning,
    isPaused,
    startTimer,
    pauseTimer,
    resetTimer,
    stopTimer,
    setTime,
    formatTime,
    getProgress
  }), [
    timeElapsed,
    isRunning,
    isPaused,
    startTimer,
    pauseTimer,
    resetTimer,
    stopTimer,
    setTime,
    formatTime,
    getProgress
  ]);
};