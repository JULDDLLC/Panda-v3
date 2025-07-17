"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { useVoice } from '@/hooks/use-voice';

interface PandaAvatarProps {
  mood?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  speakOnClick?: boolean;
  pandaName?: string;
}

export function PandaAvatar({ 
  mood = 'happy', 
  size = 'lg', 
  animate = true,
  speakOnClick = false,
  pandaName = 'Panda'
}: PandaAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { speak, isGenerating } = useVoice();
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  const moodAnimations = {
    happy: { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] },
    excited: { scale: [1, 1.2, 1], y: [0, -10, 0] },
    sad: { scale: [1, 0.9, 1], rotate: [0, -10, 0] },
    tired: { scale: [1, 0.95, 1], opacity: [1, 0.8, 1] },
    worried: { scale: [1, 0.9, 1.05, 1], x: [0, -5, 5, 0] }
  };

  const moodGreetings = {
    happy: `Hi there! I'm ${pandaName} and I'm feeling super happy today!`,
    excited: `Wow! I'm ${pandaName} and I'm so excited to meet you!`,
    sad: `Hello... I'm ${pandaName} and I'm feeling a little sad today.`,
    tired: `*yawn* Hi, I'm ${pandaName} and I'm feeling quite sleepy...`,
    worried: `Um, hello... I'm ${pandaName} and I'm feeling a bit worried right now.`
  };

  const handleClick = () => {
    if (speakOnClick && !isGenerating) {
      const greeting = moodGreetings[mood as keyof typeof moodGreetings] || moodGreetings.happy;
      speak(greeting);
    }
  };

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} mx-auto ${speakOnClick ? 'cursor-pointer' : ''}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={animate ? { scale: 1.1 } : {}}
      animate={animate && mood in moodAnimations ? moodAnimations[mood as keyof typeof moodAnimations] : {}}
      transition={{ 
        duration: 2, 
        repeat: animate ? Infinity : 0, 
        repeatType: "reverse",
        ease: "easeInOut"
      }}
      onClick={handleClick}
    >
      <div className="relative w-full h-full">
        <Image
          src="/tbd.png"
          alt="TBD the Panda"
          fill
          className="object-contain drop-shadow-2xl"
          priority
        />
        
        {/* Enhanced glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/30 via-pink-500/30 to-purple-600/30 blur-xl"
          animate={isHovered ? { 
            scale: 1.3, 
            opacity: 0.9,
            background: [
              'radial-gradient(circle, rgba(251, 146, 60, 0.3), rgba(236, 72, 153, 0.3), rgba(168, 85, 247, 0.3))',
              'radial-gradient(circle, rgba(236, 72, 153, 0.3), rgba(168, 85, 247, 0.3), rgba(251, 146, 60, 0.3))',
              'radial-gradient(circle, rgba(168, 85, 247, 0.3), rgba(251, 146, 60, 0.3), rgba(236, 72, 153, 0.3))'
            ]
          } : { 
            scale: 1, 
            opacity: 0.5 
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Click indicator */}
        {speakOnClick && isHovered && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold"
          >
            Click to speak! 🎵
          </motion.div>
        )}
        
        {/* Loading indicator when generating voice */}
        {isGenerating && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full"
            />
          </motion.div>
        )}
        
        {/* Enhanced floating particles */}
        {animate && (
          <>
            <motion.div
              className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              animate={{
                y: [0, -25, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 0
              }}
            />
            <motion.div
              className="absolute -top-4 left-4 w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 1
              }}
            />
            <motion.div
              className="absolute -bottom-2 -left-2 w-2.5 h-2.5 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full"
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: 2
              }}
            />
            <motion.div
              className="absolute top-1/2 -right-4 w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-teal-500 rounded-full"
              animate={{
                x: [0, 20, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 1.5
              }}
            />
          </>
        )}
      </div>
    </motion.div>
  );
}