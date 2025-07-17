"use client";

import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useVoice } from '@/hooks/use-voice';

interface AdventureVideoProps {
  pandaName: string;
}

export function AdventureVideo({ pandaName }: AdventureVideoProps) {
  const [hasSpoken, setHasSpoken] = useState(false);
  const { speak, isGenerating } = useVoice();

  const handleVideoIntro = () => {
    if (!hasSpoken && !isGenerating) {
      speak(`Watch as ${pandaName} discovers the magical world of adventure!`);
      setHasSpoken(true);
    }
  };

  const handleWatchVideo = () => {
    // Open YouTube video in new tab
    window.open('https://youtu.be/USKxuArodvI', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative max-w-4xl mx-auto"
    >
      <div className="glass rounded-3xl p-6 glow-purple">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-center mb-6 gradient-text"
        >
          {pandaName}'s First Adventure
        </motion.h2>
        
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/50 to-orange-900/50 mb-6">
          {/* YouTube Video Thumbnail */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="https://img.youtube.com/vi/USKxuArodvI/maxresdefault.jpg"
              alt="Adventure Video Thumbnail"
              className="w-full h-full object-cover"
            />
            
            {/* Play Button Overlay */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWatchVideo}
              className="absolute flex items-center justify-center w-20 h-20 bg-red-600/90 backdrop-blur-md rounded-full border-2 border-white/30 hover:bg-red-500/90 transition-all duration-300 shadow-2xl"
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </motion.button>
          </div>
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center space-y-4"
        >
          <p className="text-white/80 text-lg">
            Watch as {pandaName} discovers the magical world of adventure!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleVideoIntro}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
            >
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  🎵 Hear {pandaName} Speak
                </>
              )}
            </Button>
            
            <Button
              onClick={handleWatchVideo}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Watch Adventure Video
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}