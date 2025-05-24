import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Pricing() {
  const plans = [
    {
      name: "Community",
      price: "Free",
      period: "For Small Societies",
      description: "Perfect for small housing societies just getting started",
      features: [
        "Up to 20 Residents",
        "Basic Management Modules",
        "Community Notices",
        "Email Support",
        "Basic Reports",
        "Mobile App Access"
      ],
      buttonText: "Get Started",
      buttonLink: "/register",
      popular: false
    },
    {
      name: "Professional",
      price: "$49",
      period: "Per Month",
      description: "Ideal for growing communities",
      features: [
        "Up to 200 Residents",
        "All Core & Advanced Modules",
        "Priority Support",
        "Custom Branding",
        "Advanced Analytics",
        "API Access",
        "Multiple Admin Users",
        "Automated Notifications"
      ],
      buttonText: "Start Free Trial",
      buttonLink: "/register",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "For Large Communities",
      description: "Tailored solutions for large residential complexes",
      features: [
        "Unlimited Residents",
        "All Modules & Integrations",
        "Dedicated Account Manager",
        "24/7 Premium Support",
        "Custom Development",
        "White-label Solution",
        "Advanced Security",
        "SLA Guarantee"
      ],
      buttonText: "Coming Soon",
      buttonLink: "/",
      popular: false
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section
      id="pricing"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="relative overflow-hidden bg-gray-50 py-20 lg:py-[120px]"
    >
      {/* Background Pattern */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute right-0 top-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
        ></motion.div>
      </motion.div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          className="mx-auto mb-16 max-w-[620px] text-center"
        >
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary"
          >
            Pricing Plans
          </motion.span>
          <motion.h2
            variants={headerVariants}
            className="mb-4 text-3xl font-bold text-dark sm:text-4xl md:text-[40px]"
          >
            Choose the Perfect Plan for Your Society
          </motion.h2>
          <motion.p
            variants={headerVariants}
            className="text-lg text-body-color"
          >
            Flexible pricing options designed to scale with your community's needs.
            All plans include our core features and regular updates.
          </motion.p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className={`relative rounded-xl bg-white p-8 shadow-lg transition duration-300 hover:shadow-xl ${
                plan.popular ? 'border-2 border-primary' : ''
              }`}
            >
              {plan.popular && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute -right-4 -top-4 rounded-full bg-primary px-4 py-1 text-sm font-medium text-white"
                >
                  Most Popular
                </motion.div>
              )}

              {/* Plan Header */}
              <motion.div
                whileHover={{ x: 5 }}
                className="mb-8"
              >
                <h3 className="mb-2 text-2xl font-bold text-dark">{plan.name}</h3>
                <p className="mb-4 text-sm text-body-color">{plan.description}</p>
                <div className="mb-4 flex items-baseline">
                  <span className="text-4xl font-bold text-dark">{plan.price}</span>
                  <span className="ml-2 text-sm text-body-color">{plan.period}</span>
                </div>
              </motion.div>

              {/* Features List */}
              <motion.div
                variants={containerVariants}
                className="mb-8"
              >
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      variants={headerVariants}
                      className="flex items-center"
                    >
                      <motion.svg
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        className="mr-3 h-5 w-5 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                      <span className="text-base text-body-color">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={plan.buttonLink}
                  className={`block w-full rounded-lg px-6 py-3 text-center text-base font-medium transition duration-300 ${
                    plan.popular
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default Pricing;