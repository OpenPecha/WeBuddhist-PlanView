import { useClientDetails, useTimeStamps } from '@/client_details/hooks';
import { Button } from '@/components/ui/atom/button';
import { Progress } from '@/components/ui/atom/progress';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  Pause,
  Play,
  RotateCcw,
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
  imageUrl?: string;
  description?: string;
};

function AudioPlayer(props: Readonly<AudioPlayerProps>) {
  const { seriesId,imageUrl,description } = props;
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
  const [playerState, setPlayerState] = useState<number>(
    YouTube.PlayerState.UNSTARTED
  );
  const isPlaying = playerState === YouTube.PlayerState.PLAYING;
  const startTimestamp = Number(timestamps?.[0]?.time_stamp||0);
  const endTimestamp = Number(timestamps?.[timestamps.length-1]?.time_stamp||0) ;


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

  const handlePlay = () => {
    const player = getPlayer();
    if (!player) return;
    if (!timestamps) {
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
  };

  const handlePause = () => {
    getPlayer()?.pauseVideo();
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleStateChange = (event: { data: number }) => {
    setPlayerState(event.data);
  };

  const handleRestart = () => {
    const player = getPlayer();
    if (!player) return;
    if (timestamps) {
      player.seekTo(startTimestamp, true);
    } else {
      player.seekTo(0, true);
    }
    player.playVideo();
  };

  // const handleMute = () => {
  //   getPlayer()?.mute();
  // };

  // const handleUnmute = () => {
  //   getPlayer()?.unMute();
  // };

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
  }, [timestamps, videoLink]);

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
  return (
    <div className='flex-1  flex  bg-white h-20 shadow-md border-t border-l border-r border-[#ECECEC]'>
      <div className="hidden">
      {videoLink && (
        <YouTube
        ref={ref}
        videoId={videoLink}
        opts={opts}
        className="w-full h-full"
        onStateChange={handleStateChange}
        />
      )}
      </div>
      <div className="flex-1 flex p-4">
       <div className="flex items-center justify-between gap-2 relative group">
        <img src={imageUrl} alt="Series Image" className="h-full object-contain border border-[#ECECEC] opacity-75  rounded-lg group-hover:opacity-100 transition-opacity duration-300" />
        <Button
              type="button"
              size="icon"
              variant="ghost"
              className='absolute hover:bg-transparent hover:text-black cursor-pointer  top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] '
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="size-4 fill-black " />
              ) : (
                <Play className="size-4 fill-black " />
              )}
            </Button>
       </div>

      {videoLink && (
        <div
          className=" flex flex-col gap-2 rounded-lg ml-2 bg-muted/30 flex-1"
          aria-label="Audio player controls"
        >
          <div className="flex items-center justify-between gap-2 text-xs tabular-nums text-muted-foreground">
            <div
              ref={progressRef}
              role="slider"
              tabIndex={0}
              aria-label="Playback position"
              aria-valuemin={0}
              aria-valuemax={progressSpan}
              aria-valuenow={Math.max(0, currentTime - progressStart)}
              aria-valuetext={`${elapsedDisplay} of ${totalDisplay}`}
              className="min-w-0 flex-1 cursor-pointer touch-none  select-none"
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
            {/* <span className="shrink-0">{elapsedDisplay}</span>
            <span className="shrink-0">{totalDisplay}</span> */}
          </div>
          <div className="flex items-center justify-between gap-2 text-xs  tabular-nums text-muted-foreground"> 
          {/* <span className="shrink-0">{elapsedDisplay}</span> */}
          <h4 className="font-[lato] text-sm text-gray-600">{description}</h4>
          <div className="flex items-center justify-between gap-2">

          <span className="shrink-0">{elapsedDisplay} / {totalDisplay}</span>
          <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={handleRestart}
              aria-label="Restart"
            >
              <RotateCcw className="size-4" />
            </Button>
          </div>
         </div> 
        </div>
      )}
      
      </div>

    </div>
  );
}

export default AudioPlayer;
