"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { PandaAvatar } from '@/components/panda-avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { stripeProducts, getProductByPriceId } from '@/src/stripe-config';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { User, Crown, Download, LogOut, CreditCard } from 'lucide-react';

interface UserSubscription {
  subscription_status: string;
  price_id: string | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        router.push('/auth/login');
        return;
      }

      setUser(user);
      await fetchSubscription();
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!user) return;

    setIsCheckoutLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Please log in to continue');
        router.push('/auth/login');
        return;
      }

      const product = stripeProducts[0]; // Get the subscription product
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: product.priceId,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/dashboard`,
          mode: product.mode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to start checkout process');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const getSubscriptionStatus = () => {
    if (!subscription) return 'No subscription';
    
    const product = getProductByPriceId(subscription.price_id || '');
    const productName = product?.name || 'Adventure Pack';
    
    switch (subscription.subscription_status) {
      case 'active':
        return `Active - ${productName}`;
      case 'trialing':
        return `Trial - ${productName}`;
      case 'past_due':
        return `Past Due - ${productName}`;
      case 'canceled':
        return `Canceled - ${productName}`;
      case 'not_started':
        return 'No active subscription';
      default:
        return subscription.subscription_status;
    }
  };

  const isSubscriptionActive = () => {
    return subscription && ['active', 'trialing'].includes(subscription.subscription_status);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Welcome Section */}
          <div className="glass rounded-3xl p-8 mb-8 glow">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <PandaAvatar mood="happy" size="lg" />
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
                  Welcome back, Adventurer!
                </h1>
                <p className="text-white/80 text-lg mb-4">
                  Ready to continue your magical journey with your Panda?
                </p>
                
                <div className="flex items-center space-x-2 text-white/70">
                  <User className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
              </div>
              
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="glass rounded-3xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Crown className="w-6 h-6 mr-2 text-yellow-400" />
                Subscription Status
              </h2>
              
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                isSubscriptionActive() 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}>
                {getSubscriptionStatus()}
              </div>
            </div>
            
            {subscription?.current_period_end && isSubscriptionActive() && (
              <p className="text-white/70 mb-4">
                Next billing: {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                {subscription.cancel_at_period_end && (
                  <span className="text-yellow-400 ml-2">(Cancels at period end)</span>
                )}
              </p>
            )}
            
            {!isSubscriptionActive() && (
              <div className="space-y-4">
                <p className="text-white/80">
                  Unlock the complete Panda experience with exclusive content, coloring books, and bonus voice clips!
                </p>
                
                <Button
                  onClick={handleSubscribe}
                  disabled={isCheckoutLoading}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold"
                >
                  {isCheckoutLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Subscribe for ${stripeProducts[0].price}/month
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Downloads Section */}
          {isSubscriptionActive() && (
            <div className="glass rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Download className="w-6 h-6 mr-2 text-blue-400" />
                Your Downloads
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 h-auto p-6 flex-col space-y-2">
                  <Download className="w-8 h-8" />
                  <span className="font-semibold">Coloring Book</span>
                  <span className="text-sm opacity-80">20+ pages of fun activities</span>
                </Button>
                
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-auto p-6 flex-col space-y-2">
                  <Download className="w-8 h-8" />
                  <span className="font-semibold">Voice Clips</span>
                  <span className="text-sm opacity-80">Bonus panda sounds</span>
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}