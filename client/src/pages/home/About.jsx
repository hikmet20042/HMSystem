import React from 'react';
import { motion } from 'framer-motion';

function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-dark-2 dark:to-dark-1 py-20 lg:py-32"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center -mx-4"
        >
          <div className="w-full px-4 lg:w-1/2">
            <div className="mb-12 max-w-[540px] lg:mb-0">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6 text-4xl font-bold leading-tight text-dark dark:text-white sm:text-5xl sm:leading-[1.2]"
              >
                About the Housing Society Management System
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-10 text-lg leading-relaxed text-body-color dark:text-dark-6"
              >
                This web-based platform is engineered for efficient, secure, and scalable management of modern housing societies. Leveraging a modular client-server architecture (React.js frontend, Node.js/Express backend, MongoDB database), it delivers tailored dashboards, robust role-based access, and seamless workflows for residents, staff, and administrators. The system prioritizes security, usability, and future extensibility, making it an ideal solution for both small and large communities.
                <br />
                <br />
                Key highlights include JWT authentication, protected routes, maintenance and notice management, and a visually coherent, responsive UI built with Tailwind CSS. The design and implementation are documented for academic and practical reference, supporting ongoing evaluation and enhancement.
              </motion.p>
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                href="#features"
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-center text-base font-medium text-white transition-all hover:bg-primary-dark hover:shadow-lg"
              >
                Explore Features
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.a>
            </div>
          </div>

          <div className="w-full px-4 lg:w-1/2">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative overflow-hidden rounded-2xl shadow-xl"
                >
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80"
                    alt="Modern housing society"
                    className="h-[400px] w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="space-y-4"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                      alt="Community living"
                      className="h-[190px] w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-8 shadow-xl"
                  >
                    <div className="relative z-10 text-center">
                      <span className="block text-6xl font-extrabold text-white">
                        09
                      </span>
                      <span className="block text-xl font-semibold text-white">
                        Years of Excellence
                      </span>
                      <span className="block text-base font-medium text-white/80">
                        in Community Management
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-[url('/assets/images/pattern.svg')] opacity-10" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;