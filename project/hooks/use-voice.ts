import { useState, useCallback, useRef } from 'react';
import { generateSpeech, playAudio, isElevenLabsConfigured } from '@/lib/elevenlabs';
import { toast } from 'sonner';

export const useVoice = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(async (text: string) => {
    if (isGenerating || isPlaying) {
      return;
    }

    // Stop any currently playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    setIsGenerating(true);
    
    try {
      // Always try ElevenLabs first if configured
      if (isElevenLabsConfigured()) {
        console.log('Using ElevenLabs with voice ID: E95NigJoVU5BI8HjQeN3');
        const audioBlob = await generateSpeech(text);
        
        if (audioBlob) {
          setIsPlaying(true);
          const actualVolume = isMuted ? 0 : volume;
          const audio = playAudio(audioBlob, actualVolume);
          currentAudioRef.current = audio;
          
          // Listen for audio events
          audio.addEventListener('ended', () => {
            setIsPlaying(false);
            currentAudioRef.current = null;
          });

          audio.addEventListener('error', () => {
            setIsPlaying(false);
            currentAudioRef.current = null;
            toast.error('Error playing audio');
          });

          // Show success message
          toast.success('🎵 Playing with your custom ElevenLabs voice!', {
            duration: 2000,
          });
        } else {
          throw new Error('ELEVENLABS_API_FAILED');
        }
      } else {
        throw new Error('ELEVENLABS_NOT_CONFIGURED');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('🚨 ElevenLabs error, falling back to browser speech:', errorMessage);
      
      // Fallback to browser speech synthesis only if ElevenLabs fails
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = isMuted ? 0 : volume;
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        
        // Try to find a more child-friendly voice
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') || 
          voice.name.toLowerCase().includes('woman') ||
          voice.name.toLowerCase().includes('girl')
        ) || voices[0];
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        setIsPlaying(true);
        
        utterance.onend = () => {
          setIsPlaying(false);
        };
        
        utterance.onerror = () => {
          setIsPlaying(false);
          toast.error('Error playing demo voice');
        };
        
        speechSynthesis.speak(utterance);
        
        // Show specific error message based on error type
        if (errorMessage === 'ELEVENLABS_NOT_CONFIGURED') {
          toast.error('⚠️ ElevenLabs API key not configured! Using demo voice.', {
            duration: 4000,
            description: 'Check console for detailed configuration debug info'
          });
        } else if (errorMessage === 'ELEVENLABS_API_FAILED') {
          toast.error('⚠️ ElevenLabs API call failed! Using demo voice.', {
            duration: 4000,
            description: 'Check your API key, credits, and voice ID (E95NigJoVU5BI8HjQeN3)'
          });
        } else {
          toast.error('⚠️ ElevenLabs error! Using demo voice.', {
            duration: 4000,
            description: `Error: ${errorMessage}`
          });
        }
      } else {
        toast.error('Voice not supported in this browser');
      }
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, isPlaying, volume, isMuted]);

  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsPlaying(false);
    }
    
    // Also stop speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    if (currentAudioRef.current) {
      currentAudioRef.current.volume = isMuted ? volume : 0;
    }
  }, [isMuted, volume]);

  const changeVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (currentAudioRef.current && !isMuted) {
      currentAudioRef.current.volume = clampedVolume;
    }
  }, [isMuted]);

  return {
    speak,
    stopAudio,
    toggleMute,
    changeVolume,
    isGenerating,
    isPlaying,
    volume,
    isMuted,
    isConfigured: isElevenLabsConfigured(),
  };
};