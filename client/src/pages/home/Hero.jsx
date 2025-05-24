import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
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

  return (
    <motion.div
      id="home"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 pt-[120px] md:pt-[130px] lg:pt-[160px] z-30"
    >
      <div className="container mx-auto px-4 mb-20">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4">
            <motion.div
              variants={containerVariants}
              className="hero-content mx-auto max-w-[780px] text-center"
            >
              <motion.h1
                variants={itemVariants}
                className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-[1.2]"
              >
                Housing Society Management System
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="mb-8 text-xl text-white/90 leading-relaxed"
              >
                A comprehensive, web-based platform designed to streamline administration, enhance communication, and empower residents, staff, and administrators with secure, role-based access and intuitive dashboards.
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="mb-12 text-lg text-white/80"
              >
                Built with React.js, Node.js/Express, and MongoDB for scalability, security, and modern user experience.
              </motion.p>
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="rounded-md bg-white px-8 py-4 text-base font-semibold text-primary transition duration-300 ease-in-out hover:bg-white/90"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"
      ></motion.div>
    </motion.div>
  );
};

export default Hero;