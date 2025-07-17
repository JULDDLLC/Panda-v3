"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';

interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void;
  selectedMood?: string;
}

const moods = [
  { emoji: '😊', name: 'Happy', color: 'from-yellow-400 to-orange-500' },
  { emoji: '😢', name: 'Sad', color: 'from-blue-400 to-blue-600' },
  { emoji: '😴', name: 'Tired', color: 'from-purple-400 to-purple-600' },
  { emoji: '🤩', name: 'Excited', color: 'from-pink-400 to-red-500' },
  { emoji: '😰', name: 'Worried', color: 'from-gray-400 to-gray-600' },
];

export function MoodSelector({ onMoodSelect, selectedMood }: MoodSelectorProps) {
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap justify-center gap-4 p-6">
      {moods.map((mood, index) => (
        <motion.button
          key={mood.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setHoveredMood(mood.name)}
          onHoverEnd={() => setHoveredMood(null)}
          onClick={() => onMoodSelect(mood.name.toLowerCase())}
          className={`
            relative p-4 rounded-2xl glass border-2 transition-all duration-300
            ${selectedMood === mood.name.toLowerCase() 
              ? 'border-orange-400 glow' 
              : 'border-white/20 hover:border-white/40'
            }
          `}
        >
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${mood.color} opacity-20`} />
          
          <div className="relative flex flex-col items-center space-y-2">
            <span className="text-3xl">{mood.emoji}</span>
            <span className="text-sm font-medium text-white">
              {mood.name}
            </span>
          </div>
          
          {hoveredMood === mood.name && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-4 h-4 bg-orange-400 rounded-full"
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}