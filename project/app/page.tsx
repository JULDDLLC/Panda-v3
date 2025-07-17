'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PandaAvatar } from '@/components/panda-avatar';
import { MoodSelector } from '@/components/mood-selector';
import { AdventureVideo } from '@/components/adventure-video';
import { VoiceControls } from '@/components/voice-controls';
import Panda3DWrapper from '@/components/Panda3DWrapper';
import { useVoice } from '@/hooks/use-voice';
import { Sparkles, MessageCircle, Play } from 'lucide-react';

export default function HomePage() {
  const [pandaName, setPandaName] = useState('Panda');
  const [selectedMood, setSelectedMood] = useState('happy');
  const [customMessage, setCustomMessage] = useState('');
  const [pandaGreeting, setPandaGreeting] = useState('');
  const { speak, isGenerating } = useVoice();

  const getRandomGreeting = (name: string) => {
    const lines = [
      `Whoa. You made it. I thought you'd ghosted me.`,
      `Oh hey, didn't see you there. I mean, I did. I just played it cool.`,
      `I’m ${name}, and yes, I am this fluffy.`,
      `Welcome, brave human. I shall now require snacks.`,
      `Panda here. Hug-ready and dangerously charming.`
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  };

  

  useEffect(() => {
    const greeting = getRandomGreeting(pandaName);
    setPandaGreeting(greeting);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    speak(greeting);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value || 'Panda';
    setPandaName(name);
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    const moodMessages = {
      happy: `I'm ${pandaName}, and I just found a bamboo buffet. Life is good.`,
      excited: `Whoa! I'm ${pandaName}, and my excitement level is 3000. Let's freaking go!`,
      sad: `I'm ${pandaName}. Please bring snacks. Or hugs. Or both.`,
      tired: `Hey, it's ${pandaName}... I'm running on 4 hours of sleep and 3 dreams.`,
      worried: `Okay but like... what if the clouds are watching us? Just thinking out loud.`
    };
    const message = moodMessages[mood as keyof typeof moodMessages] || moodMessages.happy;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    speak(message);
  };

  const handleCustomSpeak = () => {
    if (customMessage.trim()) {
      const message = customMessage.toLowerCase().includes('banana')
        ? `${pandaName} says: Did you just say banana? I'm flattered.`
        : `${pandaName} says: ${customMessage}`;
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      speak(message);
      setCustomMessage('');
    }
  };

  const handleSampleStory = () => {
    const story = `Once upon a time, ${pandaName} the panda discovered a magical bamboo forest where every leaf sparkled like diamonds. As ${pandaName} wandered deeper into the forest, friendly fireflies began to dance around, lighting the way to an incredible adventure. Would you like to join ${pandaName} on this magical journey?`;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    speak(story);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 pt-28 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            {pandaName === 'Panda' ? 'Meet Panda' : `Meet ${pandaName}`}
          </h1>
          <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto">
            Experience magical adventures with your new panda friend! Name your panda, choose their mood, and hear them speak with AI-powered voice.
          </p>
          <p className="text-white/60 italic max-w-xl mx-auto">
            {pandaGreeting}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
            <div className="glass rounded-3xl p-8 text-center glow">
              <PandaAvatar mood={selectedMood} size="xl" animate={true} speakOnClick={true} pandaName={pandaName} />
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Hello! I'm {pandaName}
                </h3>
                <p className="text-white/80 mb-6">
                  Click on me to hear my voice! I'm feeling {selectedMood} today.
                </p>
              </motion.div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                Name Your Panda
              </h4>
              <Input
                value={pandaName === 'Panda' ? '' : pandaName}
                onChange={handleNameChange}
                placeholder="Enter a name for your panda"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>

            <div className="glass rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-blue-400" />
                Make {pandaName} Speak
              </h4>
              <div className="flex space-x-2">
                <Input
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder={`What should ${pandaName} say?`}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  onKeyPress={(e) => e.key === 'Enter' && handleCustomSpeak()}
                />
                <Button onClick={handleCustomSpeak} disabled={!customMessage.trim() || isGenerating} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Speak
                </Button>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 text-center">
              <Button onClick={handleSampleStory} disabled={isGenerating} className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3">
                <Play className="w-5 h-5 mr-2" />
                Hear a Sample Story
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
            <div className="glass rounded-3xl p-6 glow-purple">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                3D Panda Preview
              </h3>
              <div className="w-full h-[400px] rounded-xl overflow-hidden">
                <Panda3DWrapper />
              </div>
              <p className="text-white/70 text-center mt-4 text-sm">
                Interactive 3D model - no subscription required!
              </p>
            </div>
            <div className="flex justify-end">
              <VoiceControls compact={true} isGenerating={isGenerating} />
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mb-16">
          <div className="glass rounded-3xl p-8 glow">
            <h2 className="text-3xl font-bold text-center mb-6 gradient-text">
              How are you feeling today?
            </h2>
            <p className="text-white/80 text-center mb-8">
              Choose a mood and {pandaName} will respond with the perfect emotion!
            </p>
            <MoodSelector onMoodSelect={handleMoodSelect} selectedMood={selectedMood} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mb-16">
          <AdventureVideo pandaName={pandaName} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="text-center">
          <div className="glass rounded-3xl p-12 glow max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold gradient-text mb-6">
              Ready for More Adventures?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Join {pandaName} for exclusive content, coloring books, and endless magical stories!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-xl text-lg">
                  Start Your Adventure
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 py-3 px-8 rounded-xl text-lg">
                  Already Have an Account?
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
