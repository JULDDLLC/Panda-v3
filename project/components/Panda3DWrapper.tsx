'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Disable 3D model loading for publishing
const DISABLE_3D_MODEL = true;

// Dynamically import the 3D component to avoid SSR issues
const Panda3DWrapper = DISABLE_3D_MODEL ? null : dynamic(() => import('@/components/3d/Panda3DWrapper'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/80 text-sm">Loading 3D Panda...</p>
      </div>
    </div>
  )
});

const Panda3DWrapperComponent = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show disabled message if 3D model is disabled
  if (DISABLE_3D_MODEL) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-xl">
        <div className="text-center p-6">
          <div className="mx-auto mb-4 w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
            <span className="text-orange-400 text-2xl">🐼</span>
          </div>
          <h3 className="text-orange-400 font-semibold mb-2">3D Model Disabled</h3>
          <p className="text-orange-300 text-sm">
            3D model temporarily disabled for deployment
          </p>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/80 text-sm">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full h-full">
      {Panda3DWrapper && <Panda3DWrapper />}
    </div>
  );
};

export default Panda3DWrapperComponent;