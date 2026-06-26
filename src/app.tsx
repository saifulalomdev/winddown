import React, { useState, useEffect, useRef } from 'react';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import Button from './ui/button';
import { formatTime } from './utils/format-time';

const QUICK_PRESETS = [
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: '45 min', minutes: 45 },
];

export default function App(): React.JSX.Element {
  const [selectedHours, setSelectedHours] = useState<number>(0);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(5);
  const [activePreset, setActivePreset] = useState<number | null>(null);

  const [timeRemaining, setTimeRemaining] = useState<number>(300);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement>(new Audio('/soft-tick.mp3'));
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isRunning) {
      setTimeRemaining(selectedHours * 3600 + selectedMinutes * 60);
    }
  }, [selectedHours, selectedMinutes, isRunning]);

  useEffect(() => {
    const handleScreenModes = async (): Promise<void> => {
      if (isRunning) {
        if (containerRef.current?.requestFullscreen) {
          containerRef.current.requestFullscreen().catch((err) => console.error(err));
        }
        try {
          await ScreenOrientation.lock({ orientation: 'landscape' });
        } catch (err) {
          console.log('Mobile orientation lock ignored on desktop:', err);
        }
      } else {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch((err) => console.error(err));
        }
        try {
          await ScreenOrientation.unlock();
        } catch (err) {
          console.error(err);
        }
      }
    };

    handleScreenModes();
  }, [isRunning]);

  useEffect(() => {
    let interval: number | null = null;

    if (isRunning) {
      interval = window.setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            if (interval) clearInterval(interval);
            setIsRunning(false);
            return 0;
          }

          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((err) => console.log('Audio blocked:', err));

          return prevTime - 1;
        });
      }, 1000);
    } else {
      audioRef.current.pause();
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handlePreset = (minutes: number) => {
    setSelectedHours(0);
    setSelectedMinutes(minutes);
    setActivePreset(minutes);
  };

  const handleHoursChange = (h: number) => {
    setSelectedHours(h);
    setActivePreset(null);
  };

  const handleMinutesChange = (m: number) => {
    setSelectedMinutes(m);
    setActivePreset(null);
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col justify-center items-center h-screen font-sans transition-all duration-300 ease-out select-none
        ${isRunning ? 'bg-[#111111] text-white' : 'bg-[#f5f7fa] text-[#333333]'}`}
    >
      {/* Big Timer Screen Display */}
      <div className={`font-bold tabular-nums mb-8 leading-none tracking-tight transition-all duration-300
          ${isRunning ? 'text-[22vw]' : 'text-7xl text-[#2c3e50]'}`}>
        {formatTime(timeRemaining)}
      </div>

      {/* Picker + Quick-select (hidden while running) */}
      {!isRunning && (
        <div className="flex flex-col items-center gap-4 mb-6">
          {/* Hours / Minutes dropdowns */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1">
              <label className="text-xs text-gray-500 uppercase tracking-wide">Hours</label>
              <select
                value={selectedHours}
                onChange={(e) => handleHoursChange(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-base bg-white"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-center gap-1">
              <label className="text-xs text-gray-500 uppercase tracking-wide">Minutes</label>
              <select
                value={selectedMinutes}
                onChange={(e) => handleMinutesChange(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-base bg-white"
              >
                {[0, 5, 10, 15, 20, 25, 30, 45, 60].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick-select preset buttons */}
          <div className="flex gap-2">
            {QUICK_PRESETS.map(({ label, minutes }) => (
              <button
                key={minutes}
                onClick={() => handlePreset(minutes)}
                className={`px-4 py-2 rounded-lg text-sm border transition-all duration-150
                  ${activePreset === minutes
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <Button variant={isRunning ? 'ghost' : 'primary'} onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'STOP' : 'START COUNTDOWN'}
      </Button>
    </div>
  );
}