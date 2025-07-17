"use client";

import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
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
            <h1 className="text-4xl font-bold gradient-text mb-8">Terms of Use</h1>
            
            <div className="prose prose-invert max-w-none space-y-6 text-white/90">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using the Panda website and services, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Use License</h2>
                <p>
                  Permission is granted to temporarily download one copy of the materials on the Panda's website for personal, non-commercial transitory viewing only.
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>This is the grant of a license, not a transfer of title</li>
                  <li>Under this license you may not modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on the website</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Children's Privacy</h2>
                <p>
                  We are committed to protecting children's privacy. Our services are designed to be safe for children, and we do not knowingly collect personal information from children under 13 without parental consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Digital Content</h2>
                <p>
                  All digital content purchased through our Adventure Pack, including coloring books and audio clips, is for personal use only and may not be redistributed or resold.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Payment Terms</h2>
                <p>
                  All payments are processed securely through Stripe. Purchases are final, but we offer a 30-day satisfaction guarantee for our Adventure Pack.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
                <p>
                  In no event shall Panda or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Information</h2>
                <p>
                  If you have any questions about these Terms of Use, please contact us through our website or visit{' '}
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