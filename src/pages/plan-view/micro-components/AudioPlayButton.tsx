import { Button } from '@/components/ui/atom/button';
import { Pause, Play } from 'lucide-react';
import { useAudioPlayer } from './AudioPlayerContext';

type AudioPlayButtonProps = {
  className?: string;
  showText?: boolean;
  size?: 'icon' | 'icon-sm' | 'default' | 'sm' | 'lg';
  variant?: 'ghost' | 'default' | 'outline';
};

export function AudioPlayButton({
  className,
  showText = false,
  size = 'icon',
  variant = 'ghost',
}: Readonly<AudioPlayButtonProps>) {
  const { videoLink, isPlaying, togglePlayPause } = useAudioPlayer();

  if (!videoLink) return null;

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={className}
      onClick={togglePlayPause}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? (
       <>
       {showText ? <span>{isPlaying ? "Pause" : "Play"}</span> : null}
        <Pause className="size-4 fill-gray-600 text-gray-600" />
       </>
      ) : (
        <>
        {showText ? <span>{isPlaying ? "Pause" : "Play"}</span> : null}
        <Play className="size-4 fill-gray-600 text-gray-600" />
        </>
      )}
    </Button>
  );
}
