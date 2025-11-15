import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Shuffle,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Repeat,
} from "lucide-react";

interface Surah {
  id: number;
  name_ar: string;
  name_en: string;
  url: string;
}

interface PlayerProps {
  surahs: Surah[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export default function Player({
  surahs,
  currentIndex,
  setCurrentIndex,
}: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<boolean>(false);

  const surah = surahs[currentIndex];

  // Handle metadata + progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => setProgress(audio.currentTime);

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [currentIndex]);

  // Handle end of surah
  const handleEnded = () => {
    if (repeat) {
      audioRef.current?.play();
    } else if (shuffle) {
      const next = Math.floor(Math.random() * surahs.length);
      setCurrentIndex(next);
    } else {
      setCurrentIndex((currentIndex + 1) % surahs.length);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <Card className="sticky bottom-0 w-full border-t rounded-none shadow-lg">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        {/* Surah Info */}
        <div className="flex flex-col">
          <span className="font-semibold">{surah.name_ar}</span>
          <span className="text-sm text-muted-foreground">{surah.name_en}</span>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center gap-3">
            <Button
              variant={shuffle ? "default" : "ghost"}
              size="icon"
              onClick={() => setShuffle(!shuffle)}
            >
              <Shuffle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setCurrentIndex(
                  (currentIndex - 1 + surahs.length) % surahs.length
                )
              }
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={togglePlay}
              className="rounded-full w-10 h-10"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setCurrentIndex((currentIndex + 1) % surahs.length)
              }
            >
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button
              variant={repeat ? "default" : "ghost"}
              size="icon"
              onClick={() => setRepeat(!repeat)}
            >
              <Repeat className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full mt-2">
            <span className="text-xs">{formatTime(progress)}</span>
            <Slider
              value={[progress]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="flex-1"
            />
            <span className="text-xs">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Hidden Audio */}
        <audio
          ref={audioRef}
          src={surah.url}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </CardContent>
    </Card>
  );
}
