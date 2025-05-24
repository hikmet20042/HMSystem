import React from 'react';
import { motion } from 'framer-motion';
import Hero from './Hero';
import Features from './Features';
import About from './About';
import CallToAction from './CallToAction';
import Pricing from './Pricing';

import Navbar from './Navbar';
import Footer from './Footer';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

function Home() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div >
        <Navbar />
      </div>
      
      <motion.div variants={itemVariants}>
        <Hero />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Features />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <About />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <CallToAction />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Pricing />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Footer />
      </motion.div>
    </motion.div>
  );
}

export default Home;