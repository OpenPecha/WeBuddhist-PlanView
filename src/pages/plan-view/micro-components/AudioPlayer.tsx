import { usePrimaryColor } from '@/client_details/hooks';
import { Button } from '@/components/ui/atom/button';
import { Progress } from '@/components/ui/atom/progress';
import { RotateCcw } from 'lucide-react';
import { useAudioPlayer } from './AudioPlayerContext';
import { AudioPlayButton } from './AudioPlayButton';

export type AudioPlayerProps = {
  imageUrl?: string;
  description?: string;
};

function AudioPlayer(props: Readonly<AudioPlayerProps>) {
  const { imageUrl, description } = props;
  const primaryColor = usePrimaryColor();
  const {
    videoLink,
    isSeeking,
    progressPercent,
    progressSpan,
    progressStart,
    currentTime,
    elapsedDisplay,
    totalDisplay,
    progressRef,
    handleProgressPointerDown,
    handleProgressPointerMove,
    endSeek,
    handleRestart,
  } = useAudioPlayer();

  return (
    <div className="flex-1 flex bg-white h-20 shadow-md border-t border-l border-r border-[#ECECEC]">
      <div className="flex-1 flex p-2">
        <div className="flex items-center justify-between gap-2 relative group">
          <img
            src={imageUrl}
            alt="Series Image"
            className="h-full object-contain border border-[#ECECEC] opacity-75 rounded-lg group-hover:opacity-100 transition-opacity duration-300"
          />
          <AudioPlayButton
            className="absolute hover:bg-transparent hover:text-black cursor-pointer top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
          />
        </div>

        {videoLink && (
          <div
            className="flex flex-col gap-2 rounded-lg ml-2 bg-muted/30 flex-1"
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
                className="min-w-0 flex-1 cursor-pointer touch-none select-none"
                onPointerDown={handleProgressPointerDown}
                onPointerMove={handleProgressPointerMove}
                onPointerUp={endSeek}
                onPointerCancel={endSeek}
              >
                <Progress
                  value={progressPercent}
                  className="h-1.5 pointer-events-none"
                  indicatorClassName={`${isSeeking ? 'transition-none' : undefined} ${primaryColor ? `bg-[${primaryColor}]` : 'bg-[#3D3D3A]'}`}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 text-xs tabular-nums text-muted-foreground">
              <h4 className="font-[lato] text-sm text-gray-600">{description}</h4>
              <div className="flex items-center justify-between gap-2">
                <span className="shrink-0">
                  {elapsedDisplay} / {totalDisplay}
                </span>
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
