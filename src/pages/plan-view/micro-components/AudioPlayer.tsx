import { useClientDetails, useTimeStamps } from '@/client_details/hooks';
import { Button } from '@/components/ui/atom/button';
import { Progress } from '@/components/ui/atom/progress';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  Pause,
  Play,
  RotateCcw,
  Square,
  Volume2,
  VolumeX,
} from 'lucide-react';
import YouTube from 'react-youtube';
import useSeriesData from './hooks/useSeriesData';

function formatTime(seconds: number): string {
  const s = Math.floor(Math.max(0, seconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/** Timestamps are in seconds (YouTube player time). When both are set and valid, playback is restricted to [start, end). */
export type AudioPlayerProps = {
  seriesId?: string;
};

function AudioPlayer(props: Readonly<AudioPlayerProps>) {
  const { seriesId } = props;
  const seriesProgress = useSeriesData(seriesId)
  const timestamps = useTimeStamps(seriesProgress?.currentDay ?? 0)
  const { data } = useClientDetails();
  const ref = useRef<YouTube>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isSeekingRef = useRef(false);
  const videoLink = data?.video_link;
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const startTimestamp =timestamps?.[0]?.time_stamp||0;
  const endTimestamp =timestamps?.[timestamps.length-1]?.time_stamp||0;
  const clip = useMemo(() => {
    if (
      typeof startTimestamp === 'number' &&
      !Number.isNaN(startTimestamp) &&
      typeof endTimestamp === 'number' &&
      !Number.isNaN(endTimestamp) &&
      endTimestamp > startTimestamp
    ) {
      return { start: startTimestamp, end: endTimestamp };
    }
    return null;
  }, [startTimestamp, endTimestamp]);

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      ...(clip && {
        start: Math.floor(clip.start),
        end: Math.ceil(clip.end),
      }),
    },
  };

  const getPlayer = () => ref.current?.getInternalPlayer();

  const handlePlay = () => {
    const player = getPlayer();
    if (!player) return;
    if (!clip) {
      player.playVideo();
      return;
    }
    Promise.resolve(player.getCurrentTime())
      .then((t) => {
        if (typeof t !== 'number' || t < clip.start || t >= clip.end) {
          player.seekTo(clip.start, true);
        }
        player.playVideo();
      })
      .catch(() => {
        player.seekTo(clip.start, true);
        player.playVideo();
      });
  };

  const handlePause = () => {
    getPlayer()?.pauseVideo();
  };

  const handleStop = () => {
    getPlayer()?.stopVideo();
  };

  const handleRestart = () => {
    const player = getPlayer();
    if (!player) return;
    if (clip) {
      player.seekTo(clip.start, true);
    } else {
      player.seekTo(0, true);
    }
    player.playVideo();
  };

  const handleMute = () => {
    getPlayer()?.mute();
  };

  const handleUnmute = () => {
    getPlayer()?.unMute();
  };

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

          if (!clip || typeof time !== 'number') return;
          const playing = state === YouTube.PlayerState.PLAYING;
          if (!playing) return;
          if (time >= clip.end) {
            player.pauseVideo();
            player.seekTo(clip.start, true);
            setCurrentTime(clip.start);
          } else if (time < clip.start) {
            player.seekTo(clip.start, true);
            setCurrentTime(clip.start);
          }
        })
        .catch(() => {});
    }, 200);

    return () => globalThis.clearInterval(id);
  }, [clip, videoLink]);

  const progressStart = clip?.start ?? 0;
  const progressEnd = clip?.end ?? duration;
  const progressSpan = Math.max(0, progressEnd - progressStart);
  const progressPercent =
    progressSpan > 0
      ? Math.min(100, Math.max(0, ((currentTime - progressStart) / progressSpan) * 100))
      : 0;
  const elapsedDisplay = formatTime(Math.max(0, currentTime - progressStart));
  const totalDisplay = formatTime(progressSpan);

  const handleReady = () => {
    if (!clip) return;
    const player = getPlayer();
    if (!player) return;
    player.seekTo(clip.start, true);
  };

  const seekFromClientX = (clientX: number): number | null => {
    const el = progressRef.current;
    if (!el || progressSpan <= 0) return null;
    const { left, width } = el.getBoundingClientRect();
    if (width <= 0) return null;
    const ratio = Math.min(1, Math.max(0, (clientX - left) / width));
    return progressStart + ratio * progressSpan;
  };

  const applySeek = (targetTime: number) => {
    const clamped = clip
      ? Math.min(clip.end - 0.01, Math.max(clip.start, targetTime))
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

  return (
    <div className='flex-1'>
      <div className="hidden">
      {videoLink && (
        <YouTube
        ref={ref}
        videoId={videoLink}
        opts={opts}
        className="w-full h-full"
        onReady={handleReady}
        />
      )}
      </div>
      {videoLink && (
        <div
          className=" flex flex-col gap-2 rounded-lg  bg-muted/30 "
          aria-label="Audio player controls"
        >
          <div className="flex items-center justify-between gap-2 text-xs tabular-nums text-muted-foreground">
            <span className="shrink-0">{elapsedDisplay}</span>
            <div
              ref={progressRef}
              role="slider"
              tabIndex={0}
              aria-label="Playback position"
              aria-valuemin={0}
              aria-valuemax={progressSpan}
              aria-valuenow={Math.max(0, currentTime - progressStart)}
              aria-valuetext={`${elapsedDisplay} of ${totalDisplay}`}
              className="min-w-0 flex-1 cursor-pointer touch-none py-2 -my-2 select-none"
              onPointerDown={handleProgressPointerDown}
              onPointerMove={handleProgressPointerMove}
              onPointerUp={endSeek}
              onPointerCancel={endSeek}
            >
              <Progress
                value={progressPercent}
                className="h-1.5 pointer-events-none"
                indicatorClassName={isSeeking ? 'transition-none' : undefined}
              />
            </div>
            <span className="shrink-0">{totalDisplay}</span>
          </div>
          <div className="flex items-center justify-center gap-0.5">
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={handleRestart}
              aria-label="Restart"
            >
              <RotateCcw className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="default"
              onClick={handlePlay}
              aria-label="Play"
            >
              <Play className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={handlePause}
              aria-label="Pause"
            >
              <Pause className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={handleStop}
              aria-label="Stop"
            >
              <Square className="size-3.5 fill-current" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={handleMute}
              aria-label="Mute"
            >
              <VolumeX className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={handleUnmute}
              aria-label="Unmute"
            >
              <Volume2 className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioPlayer;
