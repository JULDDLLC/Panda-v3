import { supabase } from './supabase';

/**
 * Get the public URL for the panda 3D model from Supabase storage
 * @returns Promise<string | null> - The public URL or null if there's an error
 */
export const getPublicGlbUrl = async (): Promise<string | null> => {
  try {
    // First check if the file exists
    const exists = await checkGlbFileExists();
    if (!exists) {
      console.error('❌ GLB file does not exist in storage');
      return null;
    }

    const { data } = supabase.storage
      .from('media')
      .getPublicUrl('tbd.glb');

    if (data?.publicUrl) {
      // Clean up any double slashes in the URL
      const cleanedUrl = data.publicUrl.replace(/([^:]\/)\/+/g, '$1');
      console.log('✅ GLB file public URL:', cleanedUrl);
      
      // Test URL accessibility before returning
      const accessResult = await testUrlAccess(cleanedUrl);
      if (!accessResult.success) {
        console.error('❌ GLB file URL not accessible:', accessResult.message);
        console.error('Check that the Supabase "media" bucket is public and the file exists');
        return null;
      }
      
      return cleanedUrl;
    }

    console.error('❌ Failed to get public URL for GLB file');
    return null;
  } catch (error) {
    console.error('❌ Error getting GLB public URL:', error);
    return null;
  }
};

/**
 * Check if the GLB file exists in storage
 * @returns Promise<boolean> - True if file exists, false otherwise
 */
export const checkGlbFileExists = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage
      .from('media')
      .list('', {
        limit: 100,
        search: 'tbd.glb',
      });

    if (error) {
      console.error('❌ Error checking GLB file existence:', error);
      return false;
    }

    const fileExists = data?.some(file => file.name === 'tbd.glb') || false;
    console.log('🔍 GLB file exists:', fileExists);
    
    if (fileExists) {
      // Also check file size to ensure it's not empty
      const file = data?.find(f => f.name === 'tbd.glb');
      if (file && file.metadata?.size) {
        console.log('📏 GLB file size:', file.metadata.size, 'bytes');
        return file.metadata.size > 0;
      }
    }
    
    return fileExists;
  } catch (error) {
    console.error('❌ Error checking GLB file existence:', error);
    return false;
  }
};

/**
 * Log storage bucket and file info for debugging
 */
export const getStorageInfo = async (): Promise<void> => {
  try {
    console.log('🔍 Checking storage configuration...');
    
    // List buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError);
      return;
    }

    console.log('📦 Available buckets:', buckets?.map(b => b.name) || []);

    // Check if media bucket exists
    const mediaBucket = buckets?.find(b => b.name === 'media');
    if (!mediaBucket) {
      console.warn('⚠️ Media bucket not found');
      return;
    }

    console.log('✅ Media bucket found:', mediaBucket);

    // List files in media bucket
    const { data: files, error: filesError } = await supabase.storage
      .from('media')
      .list('', { limit: 100 });

    if (filesError) {
      console.error('❌ Error listing files in media bucket:', filesError);
      return;
    }

    console.log('📁 Files in media bucket:', files?.map(f => ({
      name: f.name,
      size: f.metadata?.size || 'unknown',
      lastModified: f.updated_at
    })) || []);

    // Specifically check for tbd.glb
    const glbFile = files?.find(f => f.name === 'tbd.glb');
    if (glbFile) {
      console.log('🎯 Found tbd.glb:', {
        size: glbFile.metadata?.size || 'unknown',
        lastModified: glbFile.updated_at,
        metadata: glbFile.metadata
      });
    } else {
      console.warn('⚠️ tbd.glb not found in media bucket');
    }

  } catch (error) {
    console.error('❌ Error getting storage info:', error);
  }
};

/**
 * Test if a URL is accessible
 * @param url - The URL to test
 * @returns Promise with success status and detailed error information
 */
export const testUrlAccess = async (url: string): Promise<{success: boolean, status?: number, message?: string}> => {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'cors',
      cache: 'no-cache'
    });
    
    if (response.ok) {
      return { success: true, status: response.status };
    } else {
      return { 
        success: false, 
        status: response.status, 
        message: `HTTP ${response.status}: ${response.statusText || 'Request failed'}` 
      };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown network error';
    console.error('URL access test failed:', error);
    return { success: false, message };
  }
};