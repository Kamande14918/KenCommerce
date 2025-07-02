import { Link } from 'react-router-dom'
import { 
  HiOutlinePhone, 
  HiOutlineEnvelope, 
  HiOutlineMapPin 
} from 'react-icons/hi2'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    // Customer Service section: all support-related pages
    'Customer Service': [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns & Exchanges', href: '/returns' },
      { name: 'Size Guide', href: '/size-guide' },
    ],
    // About section: company info and About page
    'About': [
      { name: 'About Us', href: '/about' },
      // { name: 'Careers', href: '/careers' }, // Placeholder, not implemented
      // { name: 'Press', href: '/press' }, // Placeholder, not implemented
      // { name: 'Sustainability', href: '/sustainability' }, // Placeholder, not implemented
      // { name: 'Affiliates', href: '/affiliates' }, // Placeholder, not implemented
    ],
    // Account section: user account and wishlist
    'Account': [
      { name: 'My Account', href: '/profile' },
      { name: 'Order History', href: '/order-history' },
      { name: 'Wishlist', href: '/wishlist' },
      // { name: 'Track Order', href: '/track-order' }, // Placeholder, not implemented
      // { name: 'Gift Cards', href: '/gift-cards' }, // Placeholder, not implemented
    ],
    // Legal section: legal and policy pages
    'Legal': [
      { name: 'Privacy Policy', href: '/privacy' }, // Placeholder, not implemented
      { name: 'Terms of Service', href: '/terms' }, // Placeholder, not implemented
      { name: 'Cookie Policy', href: '/cookies' }, // Placeholder, not implemented
      { name: 'Accessibility', href: '/accessibility' }, // Placeholder, not implemented
    ],
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold mb-6">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span>KenCommerce</span>
            </Link>
            
            <p className="text-gray-400 mb-6 max-w-md">
              Your trusted partner for quality products at unbeatable prices. 
              We're committed to providing exceptional shopping experiences.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <HiOutlinePhone className="w-5 h-5" />
                <span>+254 111 416 178</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <HiOutlineEnvelope className="w-5 h-5" />
                <span>support@kencommerce.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <HiOutlineMapPin className="w-5 h-5" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Footer links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="mt-8 sm:mt-0">
              <h3 className="font-semibold text-lg mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
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

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} KenCommerce. All rights reserved.
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <span className="text-gray-400 text-sm">We accept:</span>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-6 bg-blue-600 rounded text-xs text-white flex items-center justify-center">
                  VISA
                </div>
                <div className="w-8 h-6 bg-red-600 rounded text-xs text-white flex items-center justify-center">
                  MC
                </div>
                <div className="w-8 h-6 bg-blue-800 rounded text-xs text-white flex items-center justify-center">
                  PP
                </div>
                <div className="w-8 h-6 bg-green-600 rounded text-xs text-white flex items-center justify-center">
                  MP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
