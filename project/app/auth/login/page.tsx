"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, LogIn, AlertTriangle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check Supabase configuration first
    if (!isSupabaseConfigured()) {
      toast.error('Authentication service is not configured. Please contact support.');
      return;
    }
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase login error:', error);
        if (error.message.includes('fetch') || error.message.includes('network')) {
          toast.error('Network error: Unable to connect to authentication service.');
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('rate limit')) {
          toast.error('Too many attempts. Please wait a moment and try again.');
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        toast.success('Welcome back! Redirecting to your dashboard...');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('network'))) {
        toast.error('Network error: Please check your connection and try again.');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show configuration warning if Supabase is not set up
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen">
        <Header />
        
        <div className="container mx-auto px-4 pt-28 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Adventure</span>
            </Link>
            
            <div className="glass rounded-3xl p-8">
              <div className="text-center mb-8">
                <AlertTriangle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h1 className="text-3xl font-bold gradient-text mb-2">Configuration Required</h1>
                <p className="text-white/80">Authentication service needs to be configured</p>
              </div>
              
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 mb-6">
                <h3 className="text-orange-400 font-semibold mb-3">Setup Instructions:</h3>
                <ol className="text-white/80 space-y-2 text-sm">
                  <li>1. Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">supabase.com</a></li>
                  <li>2. Go to your project settings → API</li>
                  <li>3. Copy your Project URL and anon public key</li>
                  <li>4. Add them to your environment variables</li>
                </ol>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-4 font-mono text-sm text-white/80">
                <div className="text-green-400 mb-2"># Environment Variables</div>
                <div>NEXT_PUBLIC_SUPABASE_URL=your_project_url</div>
                <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Adventure</span>
          </Link>
          
          <div className="glass rounded-3xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
              <p className="text-white/80">Sign in to continue your panda adventure</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all duration-300"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
            
            <div className="text-center mt-6">
              <p className="text-white/80">
                Don't have an account?{' '}
                <Link 
                  href="/auth/signup" 
                  className="text-orange-400 hover:text-orange-300 transition-colors font-semibold"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}