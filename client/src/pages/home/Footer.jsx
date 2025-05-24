import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/' },
      { name: 'Our Team', path: '/' },
      { name: 'Careers', path: '/' },
      { name: 'Contact Us', path: '/' },
    ],
    product: [
      { name: 'Features', path: '/' },
      { name: 'Pricing', path: '/' },
      { name: 'Documentation', path: '/' },
      { name: 'API', path: '/' },
    ],
    support: [
      { name: 'Help Center', path: '/' },
      { name: 'Community', path: '/' },
      { name: 'Status', path: '/' },
      { name: 'FAQ', path: '/' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/' },
      { name: 'Terms of Service', path: '/' },
      { name: 'Cookie Policy', path: '/' },
      { name: 'GDPR', path: '/' },
    ],
  };

  const socialLinks = [
    {
      name: 'Facebook',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
        </svg>
      ),
      url: '/',
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" />
        </svg>
      ),
      url: '/',
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      url: '/',
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="mb-6 inline-block">
              <h2 className="text-2xl font-bold">HMSystem</h2>
            </Link>
            <p className="mb-6 text-gray-400">
              Transforming housing society management through innovative technology solutions.
            </p>
            <div className="flex justify-center space-x-4 my-4  ">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
              <div className='flex justify-around'>
          {/* Quick Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-lg font-semibold capitalize">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 transition-colors hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="mb-4 text-lg font-semibold">Subscribe to our newsletter</h3>
            <p className="mb-6 text-gray-400">
              Stay updated with the latest features and announcements.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                className="rounded-lg bg-primary px-6 py-2 font-medium text-white transition-colors hover:bg-primary/90"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>
            © {currentYear} HMS. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <Link to="/" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-white">
              Terms of Service
            </Link>
            <Link to="/" className="hover:text-white">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;