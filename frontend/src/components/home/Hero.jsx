import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { 
  HiOutlineShoppingBag, 
  HiOutlineSparkles, 
  HiOutlineTruck,
  HiOutlineArrowRight 
} from 'react-icons/hi2'
import axios from 'axios';

const heroSlugs = {
  electronics: '📱',
  fashion: '👕',
  'home-garden': '🏠',
  sports: '⚽',
};

const Hero = () => {
  const [catIds, setCatIds] = useState({});

  useEffect(() => {
    axios.get('/api/categories').then(res => {
      const cats = Array.isArray(res.data) ? res.data : (res.data.categories || []);
      const ids = {};
      cats.forEach(cat => {
        if (cat.slug === 'electronics') ids.electronics = cat._id;
        if (cat.slug === 'fashion') ids.fashion = cat._id;
        if (cat.slug === 'home-garden') ids['home-garden'] = cat._id;
        if (cat.slug === 'sports') ids.sports = cat._id;
      });
      setCatIds(ids);
    });
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-bounce-light"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-bounce-light"></div>
      </div>

      <div className="container-custom relative">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[500px] py-8 sm:py-12 lg:py-20">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8 w-full"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-xs sm:text-sm font-medium"
            >
              <HiOutlineSparkles className="w-4 h-4 mr-2" />
              New Collection Available
            </motion.div>

            {/* Heading */}
            <div className="space-y-3 sm:space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
              >
                Discover
                <span className="text-gradient block">Amazing Products</span>
                at Unbeatable Prices
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-lg"
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
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full"
            >
              <Link
                to="/products"
                className="btn-primary btn-lg group w-full sm:w-auto text-center"
              >
                <HiOutlineShoppingBag className="w-5 h-5 mr-2" />
                Shop Now
                <HiOutlineArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 pt-2 sm:pt-4"
            >
              <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <HiOutlineTruck className="w-5 h-5 mr-2 text-primary-600" />
                Free Shipping Over $50
              </div>
              <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <span className="w-5 h-5 mr-2 text-primary-600">🔒</span>
                Secure Payments
              </div>
              <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
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
            className="relative w-full"
          >
            <div className="relative">
              {/* Shop by Category Heading */}
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-white">Shop by Category</h2>
              {/* Main product showcase */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 w-full overflow-x-auto">
                {/* Electronics */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-medium min-w-[140px] sm:min-w-0"
                >
                  <Link to={catIds.electronics ? `/category/${catIds.electronics}` : '#'} className="block">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl mb-2 sm:mb-4 flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl">{heroSlugs.electronics}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-base sm:text-lg">Electronics</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Latest gadgets</p>
                  </Link>
                </motion.div>

                {/* Fashion */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-medium mt-4 sm:mt-8 min-w-[140px] sm:min-w-0"
                >
                  <Link to={catIds.fashion ? `/category/${catIds.fashion}` : '#'} className="block">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl mb-2 sm:mb-4 flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl">{heroSlugs.fashion}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-base sm:text-lg">Fashion</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Trendy styles</p>
                  </Link>
                </motion.div>

                {/* Home & Garden */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-medium -mt-2 sm:-mt-4 min-w-[140px] sm:min-w-0"
                >
                  <Link to={catIds['home-garden'] ? `/category/${catIds['home-garden']}` : '#'} className="block">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl mb-2 sm:mb-4 flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl">{heroSlugs['home-garden']}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-base sm:text-lg">Home</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Decor & more</p>
                  </Link>
                </motion.div>

                {/* Sports */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-medium mt-2 sm:mt-4 min-w-[140px] sm:min-w-0"
                >
                  <Link to={catIds.sports ? `/category/${catIds.sports}` : '#'} className="block">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl mb-2 sm:mb-4 flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl">{heroSlugs.sports}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-base sm:text-lg">Sports</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Active lifestyle</p>
                  </Link>
                </motion.div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs sm:text-sm font-bold"
              >
                20% OFF
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className="absolute bottom-4 -left-4 bg-green-400 text-green-900 px-3 py-1 rounded-full text-xs sm:text-sm font-bold"
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
