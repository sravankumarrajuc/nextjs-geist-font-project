import Link from 'next/link';

export default function Footer() {
  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'API Documentation', href: '/docs' },
      { name: 'Integrations', href: '/integrations' },
      { name: 'Security', href: '/security' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
      { name: 'Press', href: '/press' },
      { name: 'Contact', href: '/contact' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Community', href: '/community' },
      { name: 'Status', href: '/status' },
      { name: 'System Requirements', href: '/requirements' },
      { name: 'Training', href: '/training' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' },
      { name: 'Compliance', href: '/compliance' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: 'T' },
    { name: 'LinkedIn', href: '#', icon: 'L' },
    { name: 'Facebook', href: '#', icon: 'F' },
    { name: 'YouTube', href: '#', icon: 'Y' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-4">Review Pilot AI</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Transform your customer reviews into business growth with AI-powered 
                  review management, sentiment analysis, and automated responses.
                </p>
              </div>

              {/* Newsletter Signup */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Stay Updated</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors duration-300">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="font-semibold mb-3">Follow Us</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a 
                      key={index}
                      href={social.href}
                      className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-300"
                      aria-label={social.name}
                    >
                      <span className="font-bold">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Product */}
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-3">
                  {footerLinks.product.map((link, index) => (
                    <li key={index}>
                      <Link 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <Link 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-3">
                  {footerLinks.support.map((link, index) => (
                    <li key={index}>
                      <Link 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link, index) => (
                    <li key={index}>
                      <Link 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © 2024 Review Pilot AI. All rights reserved.
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-4">
                <span>🔒 SOC 2 Compliant</span>
                <span>🛡️ GDPR Ready</span>
                <span>⚡ 99.9% Uptime</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/privacy" className="hover:text-white transition-colors duration-300">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-white transition-colors duration-300">
                  Terms
                </Link>
                <Link href="/cookies" className="hover:text-white transition-colors duration-300">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
