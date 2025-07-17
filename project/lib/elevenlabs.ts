// ElevenLabs API configuration and utilities

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '';
// Always use the specific voice ID you requested
const ELEVENLABS_VOICE_ID = 'E95NigJoVU5BI8HjQeN3';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Debug logging for configuration
console.log('🔍 ElevenLabs Configuration Debug:');
console.log('  - Raw env var:', process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY);
console.log('  - API Key exists:', !!ELEVENLABS_API_KEY);
console.log('  - API Key type:', typeof ELEVENLABS_API_KEY);
console.log('  - API Key length:', ELEVENLABS_API_KEY?.length || 0);
console.log('  - API Key starts with sk_:', ELEVENLABS_API_KEY?.startsWith('sk_'));
console.log('  - API Key preview:', ELEVENLABS_API_KEY ? `${ELEVENLABS_API_KEY.substring(0, 10)}...` : 'NONE');
console.log('  - Voice ID:', ELEVENLABS_VOICE_ID);
console.log('  - All NEXT_PUBLIC env vars:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')));

export const elevenLabsConfig = {
  apiKey: ELEVENLABS_API_KEY,
  voiceId: ELEVENLABS_VOICE_ID,
  apiUrl: ELEVENLABS_API_URL,
};

export const isElevenLabsConfigured = (): boolean => {
  const isConfigured = Boolean(
    ELEVENLABS_API_KEY && 
    typeof ELEVENLABS_API_KEY === 'string' &&
    ELEVENLABS_API_KEY !== 'your_elevenlabs_api_key' &&
    ELEVENLABS_API_KEY !== '' &&
    ELEVENLABS_API_KEY.length > 10 &&
    ELEVENLABS_API_KEY.startsWith('sk_')
  );
  
  console.log('🔧 isElevenLabsConfigured result:', isConfigured);
  
  if (!isConfigured) {
    console.log('❌ Configuration failed because:');
    console.log('  - API Key exists:', !!ELEVENLABS_API_KEY);
    console.log('  - Is string:', typeof ELEVENLABS_API_KEY === 'string');
    console.log('  - Not placeholder:', ELEVENLABS_API_KEY !== 'your_elevenlabs_api_key');
    console.log('  - Not empty:', ELEVENLABS_API_KEY !== '');
    console.log('  - Length > 10:', (ELEVENLABS_API_KEY?.length || 0) > 10);
    console.log('  - Starts with sk_:', ELEVENLABS_API_KEY?.startsWith('sk_'));
    console.log('  - Current value preview:', ELEVENLABS_API_KEY ? `"${ELEVENLABS_API_KEY.substring(0, 15)}..."` : 'EMPTY/UNDEFINED');
  }
  
  return isConfigured;
};

export const generateSpeech = async (text: string): Promise<Blob | null> => {
  if (!isElevenLabsConfigured()) {
    console.warn('🚨 ElevenLabs not configured - API key missing or invalid');
    return null;
  }

  try {
    console.log('🎵 Generating speech with ElevenLabs...');
    console.log('📝 Text length:', text.length, 'characters');
    console.log('🎯 Voice ID:', ELEVENLABS_VOICE_ID);
    
    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY!,
      },
      body: JSON.stringify({
        text: text.substring(0, 500), // Limit text length
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`🚨 ElevenLabs API error: ${response.status} - ${errorText}`);
      
      // Log specific error details for debugging
      if (response.status === 401) {
        console.error('🔑 Authentication failed - check your API key');
      } else if (response.status === 422) {
        console.error('📝 Invalid request - check voice ID and text');
      } else if (response.status === 429) {
        console.error('⏰ Rate limit exceeded - too many requests');
      } else if (response.status === 400) {
        console.error('❌ Bad request - check your parameters');
      }
      
      return null;
    }

    console.log('✅ ElevenLabs API call successful');
    return await response.blob();
  } catch (error) {
    console.error('🚨 Error generating speech:', error);
    
    // Log network-specific errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('🌐 Network error - check your internet connection');
    }
    
    return null;
  }
};

export const playAudio = (audioBlob: Blob, volume: number = 1.0) => {
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.volume = Math.max(0, Math.min(1, volume)); // Clamp volume between 0 and 1
  
  audio.play().catch(error => {
    console.error('🚨 Error playing audio:', error);
  });
  
  // Clean up the URL after playing
  audio.addEventListener('ended', () => {
    URL.revokeObjectURL(audioUrl);
  });

  return audio;
};