import { useClientDetails, useTimeStamps } from '@/client_details/hooks';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import YouTube from 'react-youtube';
import useSeriesData from './hooks/useSeriesData';

type AudioPlayerContextValue = {
  seriesId: string | undefined;
  videoLink: string | undefined;
  isPlaying: boolean;
  togglePlayPause: () => void;
  handlePlay: () => void;
  handlePause: () => void;
  handleRestart: () => void;
  currentTime: number;
  duration: number;
  isSeeking: boolean;
  progressPercent: number;
  progressSpan: number;
  progressStart: number;
  elapsedDisplay: string;
  totalDisplay: string;
  progressRef: React.RefObject<HTMLDivElement | null>;
  handleProgressPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleProgressPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  endSeek: (e: React.PointerEvent<HTMLDivElement>) => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

function formatTime(seconds: number): string {
  const s = Math.floor(Math.max(0, seconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function AudioPlayerProvider({
  seriesId,
  children,
}: {
  seriesId?: string;
  children: ReactNode;
}) {
  const seriesProgress = useSeriesData(seriesId);
  const timestamps = useTimeStamps(seriesProgress?.currentDay ?? 0);
  const { data } = useClientDetails();
  const ref = useRef<YouTube>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isSeekingRef = useRef(false);
  const videoLink = data?.video_link;
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [playerState, setPlayerState] = useState<number>(
    YouTube.PlayerState.UNSTARTED
  );
  const isPlaying = playerState === YouTube.PlayerState.PLAYING;
  const startTimestamp = Number(timestamps?.[0]?.time_stamp || 0);
  const endTimestamp = Number(timestamps?.[timestamps.length - 1]?.time_stamp || 0);

  const opts = useMemo(
    () => ({
      height: '390',
      width: '640',
      playerVars: {
        autoplay: 0,
        ...(timestamps &&
          endTimestamp > startTimestamp && {
            start: Math.floor(startTimestamp),
            end: Math.ceil(endTimestamp),
          }),
      },
    }),
    [timestamps, startTimestamp, endTimestamp]
  );

  const getPlayer = () => ref.current?.getInternalPlayer();
  const handlePlay = useCallback(() => {
    const player = getPlayer();
    if (!player) return;
    if (!timestamps) {
      alert("Audio is coming soon");
      player.playVideo();
      return;
    }
    Promise.resolve(player.getCurrentTime())
      .then((t) => {
        if (typeof t !== 'number' || t < startTimestamp || t >= endTimestamp) {
          player.seekTo(startTimestamp, true);
        }
        player.playVideo();
      })
      .catch(() => {
        player.seekTo(startTimestamp, true);
        player.playVideo();
      });
  }, [timestamps, startTimestamp, endTimestamp]);

  const handlePause = useCallback(() => {
    getPlayer()?.pauseVideo();
  }, []);

  const togglePlayPause = useCallback(() => {
    if(!timestamps || timestamps?.length === 0) {
      alert("Audio is coming soon");
      return;
    }
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  }, [isPlaying, handlePause, handlePlay]);

  const handleStateChange = (event: { data: number }) => {
    setPlayerState(event.data);
  };

  const handleRestart = useCallback(() => {
    const player = getPlayer();
    if (!player) return;
    if (timestamps) {
      player.seekTo(startTimestamp, true);
    } else {
      player.seekTo(0, true);
    }
    player.playVideo();
  }, [timestamps, startTimestamp]);

  useEffect(() => {
    if (!videoLink) return;

    const id = globalThis.setInterval(() => {
      const player = ref.current?.getInternalPlayer();
      if (!player) return;

      Promise.all([
        Promise.resolve(player.getPlayerState()),
        Promise.resolve(player.getCurrentTime()),
        Promise.resolve(player.getDuration()),
      ])
        .then(([state, time, dur]) => {
          if (!isSeekingRef.current && typeof time === 'number') {
            setCurrentTime(time);
          }
          if (typeof dur === 'number' && dur > 0) setDuration(dur);
          if (typeof state === 'number') setPlayerState(state);

          if (!timestamps || typeof time !== 'number') return;
          const playing = state === YouTube.PlayerState.PLAYING;
          if (!playing) return;
          if (time >= endTimestamp) {
            player.pauseVideo();
            player.seekTo(startTimestamp, true);
            setCurrentTime(startTimestamp);
          } else if (time < startTimestamp) {
            player.seekTo(startTimestamp, true);
            setCurrentTime(startTimestamp);
          }
        })
        .catch(() => {});
    }, 200);

    return () => globalThis.clearInterval(id);
  }, [timestamps, videoLink, startTimestamp, endTimestamp]);

  const progressStart = startTimestamp ?? 0;
  const progressEnd = endTimestamp ?? duration;
  const progressSpan = Math.max(0, progressEnd - progressStart);
  const progressPercent =
    progressSpan > 0
      ? Math.min(100, Math.max(0, ((currentTime - progressStart) / progressSpan) * 100))
      : 0;
  const elapsedDisplay = formatTime(Math.max(0, currentTime - progressStart));
  const totalDisplay = formatTime(progressSpan);

  const seekFromClientX = (clientX: number): number | null => {
    const el = progressRef.current;
    if (!el || progressSpan <= 0) return null;
    const { left, width } = el.getBoundingClientRect();
    if (width <= 0) return null;
    const ratio = Math.min(1, Math.max(0, (clientX - left) / width));
    return progressStart + ratio * progressSpan;
  };

  const applySeek = (targetTime: number) => {
    const clamped = timestamps
      ? Math.min(endTimestamp - 0.01, Math.max(startTimestamp, targetTime))
      : Math.min(duration || targetTime, Math.max(0, targetTime));
    setCurrentTime(clamped);
    getPlayer()?.seekTo(clamped, true);
  };

  const handleProgressPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (progressSpan <= 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isSeekingRef.current = true;
    setIsSeeking(true);
    const target = seekFromClientX(e.clientX);
    if (target !== null) applySeek(target);
  };

  const handleProgressPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId) || progressSpan <= 0) return;
    const target = seekFromClientX(e.clientX);
    if (target !== null) applySeek(target);
  };

  const endSeek = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    isSeekingRef.current = false;
    setIsSeeking(false);
  };

  const value = useMemo<AudioPlayerContextValue>(
    () => ({
      seriesId,
      videoLink,
      isPlaying,
      togglePlayPause,
      handlePlay,
      handlePause,
      handleRestart,
      currentTime,
      duration,
      isSeeking,
      progressPercent,
      progressSpan,
      progressStart,
      elapsedDisplay,
      totalDisplay,
      progressRef,
      handleProgressPointerDown,
      handleProgressPointerMove,
      endSeek,
    }),
    [
      seriesId,
      videoLink,
      isPlaying,
      togglePlayPause,
      handlePlay,
      handlePause,
      handleRestart,
      currentTime,
      duration,
      isSeeking,
      progressPercent,
      progressSpan,
      progressStart,
      elapsedDisplay,
      totalDisplay,
    ]
  );
  return (
    <AudioPlayerContext.Provider value={value}>
      <div className="hidden" aria-hidden>
        {timestamps && videoLink && (
          <YouTube
            ref={ref}
            videoId={videoLink}
            opts={opts}
            className="w-full h-full"
            onStateChange={handleStateChange}
          />
        )}
      </div>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  }
  return ctx;
}
