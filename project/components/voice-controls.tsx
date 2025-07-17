"use client";

import { motion } from 'framer-motion';
import { Volume2, VolumeX, Square, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useVoice } from '@/hooks/use-voice';
import { useState } from 'react';

interface VoiceControlsProps {
  className?: string;
  compact?: boolean;
  isGenerating?: boolean;
}

export function VoiceControls({ className = '', compact = false, isGenerating = false }: VoiceControlsProps) {
  const { 
    isPlaying, 
    volume, 
    isMuted, 
    toggleMute, 
    changeVolume, 
    stopAudio,
    isConfigured,
    isGenerating: hookIsGenerating
  } = useVoice();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const actualIsGenerating = isGenerating || hookIsGenerating;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative ${className}`}
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="ghost"
          size="sm"
          className="glass text-white hover:bg-white/20 rounded-full w-10 h-10 p-0 border border-white/20"
        >
          <Volume2 className="w-4 h-4" />
        </Button>
        
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute top-12 right-0 glass rounded-xl p-3 min-w-[200px] border border-white/20 z-50"
          >
            <VoiceControlsContent 
              isPlaying={isPlaying}
              volume={volume}
              isMuted={isMuted}
              toggleMute={toggleMute}
              changeVolume={changeVolume}
              stopAudio={stopAudio}
              isGenerating={actualIsGenerating}
            />
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-xl p-3 border border-white/20 ${className}`}
    >
      <VoiceControlsContent 
        isPlaying={isPlaying}
        volume={volume}
        isMuted={isMuted}
        toggleMute={toggleMute}
        changeVolume={changeVolume}
        stopAudio={stopAudio}
        isGenerating={actualIsGenerating}
      />
    </motion.div>
  );
}

interface VoiceControlsContentProps {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  toggleMute: () => void;
  changeVolume: (volume: number) => void;
  stopAudio: () => void;
  isGenerating: boolean;
}

function VoiceControlsContent({
  isPlaying,
  volume,
  isMuted,
  toggleMute,
  changeVolume,
  stopAudio,
  isGenerating
}: VoiceControlsContentProps) {
  return (
    <div className="space-y-2">
      {/* Audio Controls */}
      <div className="flex items-center space-x-3">
        {/* Stop Button - Always visible when audio is playing or generating */}
        {(isPlaying || isGenerating) && (
          <Button
            onClick={stopAudio}
            variant="ghost"
            size="sm"
            className="text-red-400 hover:bg-red-400/10 rounded-full w-8 h-8 p-0 border border-red-400/20"
            title="Stop audio"
          >
            <Square className="w-4 h-4" />
          </Button>
        )}

        {/* Mute/Unmute Button */}
        <Button
          onClick={toggleMute}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10 rounded-full w-8 h-8 p-0 border border-white/20"
          title={isMuted ? "Unmute" : "Mute"}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-green-400" />
            )}
          </motion.div>
        </Button>

        {/* Volume Slider */}
        <div className="flex items-center space-x-2 flex-1 min-w-[80px]">
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            onValueChange={(value) => changeVolume(value[0] / 100)}
            max={100}
            step={5}
            className="flex-1"
          />
          <span className="text-xs text-white/70 w-8 text-right font-mono">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}