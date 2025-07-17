"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image
              src="/tbd-logo.png"
              alt="TBD the Panda"
              width={50}
              height={50}
              className="rounded-full glow"
            />
          </motion.div>
          <span className="text-xl font-bold gradient-text-warm">
            Panda
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Link 
                href="/dashboard" 
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link 
                href="/auth/login" 
                className="text-white/80 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link href="/auth/signup">
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          
          <Link 
            href="/terms" 
            className="text-white/80 hover:text-white transition-colors"
          >
            Terms
          </Link>
          <Link 
            href="/privacy" 
            className="text-white/80 hover:text-white transition-colors"
          >
            Privacy
          </Link>
          <a 
            href="https://juldd.me" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span>JULDD</span>
          </a>
        </nav>
      </div>
    </motion.header>
  );
}