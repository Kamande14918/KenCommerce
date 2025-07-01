import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Hero from '../components/home/Hero'
import FeaturedProducts from '../components/home/FeaturedProducts'
import Categories from '../components/home/Categories'
import Newsletter from '../components/home/Newsletter'
import WhyChooseUs from '../components/home/WhyChooseUs'

const Home = () => {
  useEffect(() => {
    // Any initialization logic for home page
  }, [])

  return (
    <>
      <Helmet>
        <title>KenCommerce - Modern eCommerce Platform | Shop Electronics, Fashion & More</title>
        <meta 
          name="description" 
          content="Discover amazing products at unbeatable prices. Shop electronics, fashion, home goods and more at KenCommerce. Fast shipping, secure payments, and excellent customer service." 
        />
        <meta name="keywords" content="ecommerce, shopping, electronics, fashion, home goods, online store" />
        <meta property="og:title" content="KenCommerce - Modern eCommerce Platform" />
        <meta property="og:description" content="Discover amazing products at unbeatable prices. Shop electronics, fashion, home goods and more." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="pt-16 lg:pt-24">
        {/* Hero Section */}
        <Hero />

        {/* Featured Categories */}
        <Categories />

        {/* Featured Products */}
        <FeaturedProducts />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Newsletter */}
        <Newsletter />
      </div>
    </>
  )
}

export default Home
