import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { Button } from '@/components/ui/atom/button';
import { Pause, Play } from 'lucide-react';
import { useAudioPlayer } from './AudioPlayerContext';

type AudioPlayButtonBaseProps = {
  className?: string;
  showText?: boolean;
  size?: 'icon' | 'icon-sm' | 'default' | 'sm' | 'lg';
  variant?: 'ghost' | 'default' | 'outline';
};

export type AudioPlayButtonProps = AudioPlayButtonBaseProps & {
  src?: string;
  startMs?: number;
  endMs?: number;
  stopPropagation?: boolean;
};

type ClipAudioPlayButtonProps = AudioPlayButtonBaseProps & {
  src: string;
  startMs: number;
  endMs: number;
  stopPropagation?: boolean;
};

function PlayPauseButtonUI({
  className,
  showText,
  size,
  variant,
  isPlaying,
  disabled,
  onClick,
  'aria-label': ariaLabel,
}: Readonly<
  AudioPlayButtonBaseProps & {
    isPlaying: boolean;
    disabled?: boolean;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    'aria-label'?: string;
  }
>) {
  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={className}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel ?? (isPlaying ? 'Pause' : 'Play')}
    >
      {isPlaying ? (
        <>
          {showText ? <span>Pause</span> : null}
          <Pause className="size-4 fill-gray-600 text-gray-600" />
        </>
      ) : (
        <>
          {showText ? <span>Play</span> : null}
          <Play className="size-4 fill-gray-600 text-gray-600" />
        </>
      )}
    </Button>
  );
}

function ClipAudioPlayButton({
  src,
  startMs,
  endMs,
  stopPropagation = false,
  ...buttonProps
}: Readonly<ClipAudioPlayButtonProps>) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const stopTimerRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startSec = startMs / 1000;
  const endSec = endMs / 1000;
  const hasEnd = endSec > startSec;

  const clearStopTimer = useCallback(() => {
    if (stopTimerRef.current != null) {
      globalThis.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  }, []);

  const resetToStart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    clearStopTimer();
    audio.pause();
    audio.currentTime = startSec;
    setIsPlaying(false);
    setIsLoading(false);
  }, [clearStopTimer, startSec]);

  const scheduleAutoStop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !hasEnd) return;

    clearStopTimer();

    const remainingMs = Math.max((endSec - audio.currentTime) * 1000, 0);

    stopTimerRef.current = globalThis.setTimeout(() => {
      resetToStart();
    }, remainingMs);
  }, [clearStopTimer, endSec, hasEnd, resetToStart]);

  const playClip = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsLoading(true);

    try {
      const beforeStart = audio.currentTime < startSec;
      const afterEnd = hasEnd && audio.currentTime >= endSec;

      if (beforeStart || afterEnd || audio.currentTime === 0) {
        audio.currentTime = startSec;
      }

      await audio.play();

      setIsPlaying(true);
      scheduleAutoStop();
    } catch (error) {
      console.error('Could not play audio:', error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, [startSec, endSec, hasEnd, scheduleAutoStop]);

  const pauseClip = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    clearStopTimer();
    audio.pause();
    setIsPlaying(false);
  }, [clearStopTimer]);

  const handleToggle = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (stopPropagation) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (isPlaying) {
        pauseClip();
      } else {
        void playClip();
      }
    },
    [isPlaying, pauseClip, playClip, stopPropagation]
  );

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = startSec;
  }, [startSec]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !hasEnd) return;

    if (audio.currentTime >= endSec) {
      resetToStart();
    }
  }, [endSec, hasEnd, resetToStart]);

  useEffect(() => {
    return () => {
      clearStopTimer();
    };
  }, [clearStopTimer]);

  useEffect(() => {
    resetToStart();
  }, [src, startMs, endMs, resetToStart]);

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={resetToStart}
      />
      <PlayPauseButtonUI
        {...buttonProps}
        isPlaying={isPlaying}
        disabled={isLoading}
        onClick={handleToggle}
      />
    </>
  );
}

function ContextAudioPlayButton(props: Readonly<AudioPlayButtonBaseProps>) {
  const { isPlaying, togglePlayPause } = useAudioPlayer();

  return (
    <PlayPauseButtonUI
      {...props}
      isPlaying={isPlaying}
      onClick={togglePlayPause}
    />
  );
}

export function AudioPlayButton({
  src,
  startMs,
  endMs,
  stopPropagation,
  ...buttonProps
}: Readonly<AudioPlayButtonProps>) {
  if (src != null && startMs != null && endMs != null) {
    return (
      <ClipAudioPlayButton
        src={src}
        startMs={startMs}
        endMs={endMs}
        stopPropagation={stopPropagation}
        {...buttonProps}
      />
    );
  }

  return <ContextAudioPlayButton {...buttonProps} />;
}
