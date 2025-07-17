"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPublicGlbUrl, checkGlbFileExists, getStorageInfo } from '@/lib/storage';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Cuboid as Cube, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Panda3DModelProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Panda3DModel({ className = '', size = 'lg' }: Panda3DModelProps) {
  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fileExists, setFileExists] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-80 h-80'
  };

  const loadGlbModel = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured');
      }

      await getStorageInfo();
      const exists = await checkGlbFileExists();
      setFileExists(exists);

      if (!exists) {
        throw new Error('GLB file not found in storage');
      }

      const url = await getPublicGlbUrl();
      if (!url) {
        throw new Error('Failed to get public URL for GLB file');
      }

      setGlbUrl(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGlbModel();
  }, []);

  if (!isSupabaseConfigured()) {
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
        <div className="glass rounded-2xl p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
          <p className="text-white/80 text-sm">Supabase not configured</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${sizeClasses[size]} ${className} relative`}
    >
      <div className="glass rounded-2xl p-6 h-full flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full mx-auto mb-3"
            />
            <p className="text-white/80 text-sm">Loading 3D Model...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <Button
              onClick={loadGlbModel}
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        ) : glbUrl ? (
          <div className="text-center">
            <motion.div
              animate={{
                rotateY: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="mb-3"
            >
              <Cube className="w-12 h-12 text-orange-400 mx-auto" />
            </motion.div>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <p className="text-green-400 text-sm font-semibold">3D Model Ready</p>
              </div>
              <p className="text-white/60 text-xs">GLB file loaded successfully</p>
              <div className="bg-black/20 rounded-lg p-2 mt-3">
                <p className="text-white/40 text-xs font-mono break-all">
                  {glbUrl}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <p className="text-yellow-400 text-sm">No 3D model found</p>
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-4 text-center">
          <div className="bg-black/30 rounded-lg p-2">
            <p className="text-white/60 text-xs mb-1">Debug Info:</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-white/40">File exists:</span>
                <span className={fileExists ? 'text-green-400' : 'text-red-400'}>
                  {fileExists ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-white/40">Supabase:</span>
                <span className="text-green-400">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
