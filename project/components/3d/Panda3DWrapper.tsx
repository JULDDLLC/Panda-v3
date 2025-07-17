'use client';

import { useEffect, useState } from 'react';
import PlushyPandaScene from './PlushyPandaScene';
import { getPublicGlbUrl, checkGlbFileExists, testUrlAccess } from '@/lib/storage';
import { isSupabaseConfigured } from '@/lib/supabase';
import { AlertTriangle, RefreshCw, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Disable 3D model loading for publishing - prevents GLB loading errors
const DISABLE_3D_MODEL = true;

export default function Panda3DWrapper() {
  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadModelUrl = async () => {
    // Immediately return if 3D model is disabled - prevents all GLB loading
    if (DISABLE_3D_MODEL) {
      setError('3D model disabled for deployment');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!isSupabaseConfigured()) {
        // Fallback to a placeholder or demo model
        console.warn('Supabase not configured, using fallback');
        setError('Supabase storage not configured');
        setLoading(false);
        return;
      }

      console.log('Checking if GLB file exists...');
      const exists = await checkGlbFileExists();
      
      if (!exists) {
        setError('3D model file not found. Please upload tbd.glb to the Supabase "media" bucket and ensure it\'s publicly accessible.');
        setLoading(false);
        return;
      }

      console.log('Getting public URL for GLB file...');
      const url = await getPublicGlbUrl();
      
      if (!url) {
        setError('Could not access 3D model. Please check that the Supabase "media" bucket is public and contains tbd.glb.');
        setLoading(false);
        return;
      }

      console.log('GLB URL obtained:', url);
      
      // Test if the URL is accessible
      try {
        const accessResult = await testUrlAccess(url);
        if (!accessResult.success) {
          const errorMsg = accessResult.status 
            ? `File not accessible (${accessResult.status}): ${accessResult.message}`
            : `File not accessible: ${accessResult.message || 'Unknown error'}`;
          throw new Error(errorMsg);
        }
        console.log('GLB file is accessible');
        setGlbUrl(url);
      } catch (fetchError) {
        console.error('GLB file not accessible:', fetchError);
        const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error';
        setError(`3D model file not accessible: ${errorMessage}. Please check Supabase storage permissions.`);
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      console.error('Error loading model URL:', message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModelUrl();
  }, []);

  if (!isSupabaseConfigured()) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-xl">
        <div className="text-center p-6">
          <AlertTriangle className="mx-auto mb-4 w-12 h-12 text-orange-400" />
          <h3 className="text-white font-semibold mb-2">Storage Not Configured</h3>
          <p className="text-white/80 text-sm mb-4">
            Supabase storage is required for 3D model rendering
          </p>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-xs text-orange-300">
            Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/80 text-sm">Initializing 3D Panda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-xl">
        <div className="text-center p-6 max-w-sm">
          {DISABLE_3D_MODEL ? (
            <>
              <div className="mx-auto mb-4 w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <span className="text-orange-400 text-2xl">🐼</span>
              </div>
              <h3 className="text-orange-400 font-semibold mb-2">3D Model Disabled</h3>
              <p className="text-orange-300 text-sm mb-4">
                3D model is temporarily disabled for deployment. 
                Configure Supabase storage to re-enable.
              </p>
            </>
          ) : (
            <>
              <AlertTriangle className="mx-auto mb-4 w-12 h-12 text-red-400" />
              <h3 className="text-red-400 font-semibold mb-2">3D Model Error</h3>
              <p className="text-red-300 text-sm mb-4">{error}</p>
            </>
          )}
          
          {!DISABLE_3D_MODEL && error.includes('not found') && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
              <div className="flex items-center text-blue-400 text-xs mb-2">
                <Upload className="w-3 h-3 mr-1" />
                <span>Upload Required</span>
              </div>
              <p className="text-blue-300 text-xs">
                Upload 'tbd.glb' to your Supabase storage 'media' bucket
              </p>
            </div>
          )}
          
          {!DISABLE_3D_MODEL && (
            <Button 
              onClick={loadModelUrl} 
              variant="outline" 
              className="text-white border-white/20 hover:bg-white/10"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!glbUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900/20 to-slate-900/20 rounded-xl">
        <div className="text-center p-6">
          <AlertTriangle className="mx-auto mb-4 w-12 h-12 text-gray-400" />
          <p className="text-gray-400 text-sm">No 3D model URL available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-white/10">
      <PlushyPandaScene glbUrl={glbUrl} />
    </div>
  );
}