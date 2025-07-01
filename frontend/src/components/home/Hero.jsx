import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  HiOutlineShoppingBag, 
  HiOutlineSparkles, 
  HiOutlineTruck,
  HiOutlineArrowRight 
} from 'react-icons/hi2'

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-bounce-light"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-bounce-light"></div>
      </div>

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px] py-12 lg:py-20">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
            >
              <HiOutlineSparkles className="w-4 h-4 mr-2" />
              New Collection Available
            </motion.div>

            {/* Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
              >
                Discover
                <span className="text-gradient block">Amazing Products</span>
                at Unbeatable Prices
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-600 dark:text-gray-300 max-w-lg"
              >
                Shop the latest trends in electronics, fashion, home goods and more. 
                Fast shipping, secure payments, and excellent customer service guaranteed.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/products"
                className="btn-primary btn-lg group"
              >
                <HiOutlineShoppingBag className="w-5 h-5 mr-2" />
                Shop Now
                <HiOutlineArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/categories"
                className="btn-outline btn-lg"
              >
                Browse Categories
              </Link>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <HiOutlineTruck className="w-5 h-5 mr-2 text-primary-600" />
                Free Shipping Over $50
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="w-5 h-5 mr-2 text-primary-600">🔒</span>
                Secure Payments
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="w-5 h-5 mr-2 text-primary-600">⚡</span>
                24/7 Support
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main product showcase */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-medium"
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl mb-4 flex items-center justify-center">
                    <span className="text-4xl">📱</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Electronics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Latest gadgets</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-medium mt-8"
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl mb-4 flex items-center justify-center">
                    <span className="text-4xl">👕</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Fashion</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Trendy styles</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-medium -mt-4"
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl mb-4 flex items-center justify-center">
                    <span className="text-4xl">🏠</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Home</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Decor & more</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-medium mt-4"
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl mb-4 flex items-center justify-center">
                    <span className="text-4xl">⚽</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Sports</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active lifestyle</p>
                </motion.div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold"
              >
                20% OFF
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className="absolute bottom-4 -left-4 bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-bold"
              >
                Free Ship
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
