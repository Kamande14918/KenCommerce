import React from 'react';

const Shipping = () => (
  <div className="pt-24 min-h-screen bg-gray-50">
    <div className="container-custom py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Shipping Information</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Delivery Options</h2>
        <ul className="list-disc ml-6 text-gray-600">
          <li><strong>Standard Delivery:</strong> 2-5 business days (Ksh 250)</li>
          <li><strong>Express Delivery:</strong> 1-2 business days (Ksh 500)</li>
          <li><strong>Same Day Delivery:</strong> Available in Nairobi for orders placed before 12pm (Ksh 700)</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Shipping Times</h2>
        <p className="text-gray-700">Orders are processed Monday to Saturday. Orders placed after 12pm or on Sundays/public holidays will be processed the next business day.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Shipping Costs</h2>
        <p className="text-gray-700">Shipping costs are calculated at checkout based on your delivery location and selected shipping method. Free shipping is available for orders over Ksh 5,000.</p>
      </section>
    </div>
  </div>
);

export default Shipping; 