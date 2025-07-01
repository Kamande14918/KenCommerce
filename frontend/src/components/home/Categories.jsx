import { Link } from 'react-router-dom'

const Categories = () => {
  const categories = [
    { name: 'Electronics', icon: '📱', slug: 'electronics' },
    { name: 'Fashion', icon: '👕', slug: 'fashion' },
    { name: 'Home & Garden', icon: '🏠', slug: 'home-garden' },
    { name: 'Sports', icon: '⚽', slug: 'sports' },
    { name: 'Beauty', icon: '💄', slug: 'beauty' },
    { name: 'Books', icon: '📚', slug: 'books' },
  ]

  return (
    <section className="section bg-gray-50 dark:bg-gray-800">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore our wide range of product categories
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="group bg-white dark:bg-gray-900 rounded-xl p-6 text-center hover:shadow-medium transition-all duration-300"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories
