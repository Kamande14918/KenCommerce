const FeaturedProducts = () => {
  return (
    <section className="section bg-white dark:bg-gray-900">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our handpicked selection of the best products across all categories
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="product-card">
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Product {item}</h3>
              <p className="text-primary-600 font-bold">$99.99</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
