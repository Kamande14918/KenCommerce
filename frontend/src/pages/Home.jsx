import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Hero from '../components/home/Hero'
import FeaturedProducts from '../components/home/FeaturedProducts'
import Categories from '../components/home/Categories'
import Newsletter from '../components/home/Newsletter'
import WhyChooseUs from '../components/home/WhyChooseUs'
import SearchBar from '../components/home/SearchBar'
import HeroCategories from '../components/home/HeroCategories'

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

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 flex flex-col gap-6">
        <SearchBar />
        <HeroCategories />
        <FeaturedProducts />
        <Categories />
        <div className="flex flex-col gap-8 md:gap-12">
          {/* Hero Section */}
          <section className="flex flex-col md:flex-row items-center gap-8">
            <Hero />
          </section>

          {/* Why Choose Us */}
          <WhyChooseUs />

          {/* Newsletter */}
          <section className="w-full max-w-lg mx-auto">
            <Newsletter />
          </section>
        </div>
      </div>
    </>
  )
}

export default Home
