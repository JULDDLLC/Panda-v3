"use client";

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah M.",
    role: "Mom of 2",
    content: "My kids absolutely love Panda! The interactive features keep them engaged for hours.",
    rating: 5,
    avatar: "👩‍💼"
  },
  {
    name: "Mike D.",
    role: "Father",
    content: "My kid is't bored and he's learning as he explores!",
    rating: 5,
    avatar: "👨‍💻"
  },
  {
    name: "Lisa K.",
    role: "Teacher",
    content: "Perfect educational tool. My students learn while having fun with Panda.",
    rating: 5,
    avatar: "👩‍🏫"
  }
];

export function Testimonials() {
  return (
    <div className="py-16">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-12 gradient-text"
      >
        What Families Are Saying
      </motion.h3>
      
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ y: -5 }}
            className="glass rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            
            <p className="text-white/90 mb-4 italic">
              "{testimonial.content}"
            </p>
            
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{testimonial.avatar}</span>
              <div>
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-white/60 text-sm">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}