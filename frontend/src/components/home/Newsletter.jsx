const Newsletter = () => {
  return (
    <section className="section bg-primary-600">
      <div className="container-custom">
        <div className="text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Stay Updated with Our Newsletter
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Get the latest updates on new products, exclusive deals, and special offers
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
