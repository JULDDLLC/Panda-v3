"use client";

import { motion } from 'framer-motion';
import { Check, Download, Sparkles, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { stripeProducts } from '@/src/stripe-config';

interface PricingCardProps {
  onPurchase: () => void;
  isLoading?: boolean;
}

const features = [
  'Exclusive PDF Coloring Book (20+ pages)',
  'Bonus Panda Voice Clips Collection',
  'Interactive Adventure Stories',
  'Printable Activity Sheets',
  'Digital Sticker Pack',
  'Lifetime Access to Updates'
];

export function PricingCard({ onPurchase, isLoading }: PricingCardProps) {
  const product = stripeProducts[0]; // Get the subscription product

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-md mx-auto"
    >
      <div className="glass rounded-3xl p-8 border-2 border-gradient-to-r from-orange-400/50 via-pink-400/50 to-purple-400/50 relative overflow-hidden group">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-purple-500/10 to-pink-500/10 opacity-80" />
        <motion.div
          animate={{ 
            background: [
              'linear-gradient(45deg, rgba(251, 146, 60, 0.1), rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))',
              'linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(251, 146, 60, 0.1), rgba(168, 85, 247, 0.1))',
              'linear-gradient(45deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1), rgba(251, 146, 60, 0.1))'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        />
        
        {/* Floating sparkles */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-4 right-4"
        >
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </motion.div>
        
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-16 left-4"
        >
          <Star className="w-4 h-4 text-pink-400" />
        </motion.div>
        
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-6 right-8"
        >
          <Crown className="w-5 h-5 text-orange-400" />
        </motion.div>
        
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="text-center mb-6"
          >
            <motion.div
              animate={{ 
                background: [
                  'linear-gradient(45deg, #f59e0b, #ec4899, #8b5cf6)',
                  'linear-gradient(45deg, #ec4899, #8b5cf6, #f59e0b)',
                  'linear-gradient(45deg, #8b5cf6, #f59e0b, #ec4899)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="bg-clip-text text-transparent"
            >
              <h3 className="text-2xl font-bold mb-2">
                {product.name}
              </h3>
            </motion.div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-4xl font-bold text-white">${product.price}</span>
              <span className="text-xl text-white/60">/month</span>
            </div>
            <p className="text-white/80 text-sm mt-2">
              Unlock exclusive content and adventures with {product.description}
            </p>
          </motion.div>
          
          <div className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
                <span className="text-white/90 text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onPurchase}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 text-white font-bold py-4 rounded-2xl transition-all duration-500 shadow-2xl hover:shadow-pink-500/25 border border-white/20 backdrop-blur-sm relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex items-center justify-center space-x-3">
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Subscribe Now</span>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      ✨
                    </motion.div>
                  </>
                )}
              </div>
            </Button>
          </motion.div>
          
          <p className="text-center text-white/60 text-xs mt-4">
            Secure payment powered by Stripe • Cancel anytime
          </p>
        </div>
      </div>
    </motion.div>
  );
}