"use client";

import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Adventure</span>
          </Link>
          
          <div className="glass rounded-3xl p-8 md:p-12">
            <h1 className="text-4xl font-bold gradient-text mb-8">Privacy Policy</h1>
            
            <div className="prose prose-invert max-w-none space-y-6 text-white/90">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
                <p>
                  We collect information you provide directly to us, such as when you create a panda profile, make a purchase, or contact us for support.
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Panda names and preferences</li>
                  <li>Payment information (processed securely by Stripe)</li>
                  <li>Email addresses for purchase confirmations</li>
                  <li>Usage data to improve our services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                <p>
                  We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Children's Privacy Protection</h2>
                <p>
                  We take special care to protect children's privacy. We do not knowingly collect personal information from children under 13 without verifiable parental consent. If we learn that we have collected personal information from a child under 13, we will delete that information as quickly as possible.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payment processing is handled securely by Stripe.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Third-Party Services</h2>
                <p>
                  We use trusted third-party services to enhance your experience:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Supabase for secure data storage</li>
                  <li>Stripe for payment processing</li>
                  <li>ElevenLabs for voice generation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights</h2>
                <p>
                  You have the right to access, update, or delete your personal information. You can also opt out of certain communications from us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Changes to This Policy</h2>
                <p>
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us through our website or visit{' '}
                  <a 
                    href="https://juldd.me" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    JULDD Media
                  </a>.
                </p>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}