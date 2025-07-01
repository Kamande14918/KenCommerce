const WhyChooseUs = () => {
  const features = [
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Free shipping on orders over $50. Express delivery available.'
    },
    {
      icon: '🔒',
      title: 'Secure Payments',
      description: 'Your payment information is safe with SSL encryption.'
    },
    {
      icon: '↩️',
      title: 'Easy Returns',
      description: '30-day return policy. No questions asked.'
    },
    {
      icon: '💬',
      title: '24/7 Support',
      description: 'Our customer service team is always here to help.'
    }
  ]

  return (
    <section className="section bg-white dark:bg-gray-900">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose KenCommerce?
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We're committed to providing the best shopping experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
