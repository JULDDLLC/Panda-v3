"use client";

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="border-t border-white/10 bg-black/20 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-white/80">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-sm">
              © 2025 JULDD LLC. All rights reserved.
            </span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-white/60">
            <a 
              href="https://juldd.me" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              JULDD Media
            </a>
            <span>•</span>
            <span>Made with ❤️ for families</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}