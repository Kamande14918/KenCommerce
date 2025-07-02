import React from 'react';

const About = () => (
  <div className="pt-24 min-h-screen bg-gray-50">
    <div className="container-custom py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About KenCommerce</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Our Story</h2>
        <p className="text-gray-700 mb-2">KenCommerce was founded with a vision to make quality products accessible to everyone in Kenya and beyond. We believe in fair prices, excellent service, and a seamless online shopping experience.</p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
        <p className="text-gray-700 mb-2">To empower customers with a wide selection of products, fast delivery, and outstanding customer support. We are committed to innovation and continuous improvement.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Our Values</h2>
        <ul className="list-disc ml-6 text-gray-600">
          <li>Customer First</li>
          <li>Integrity & Transparency</li>
          <li>Innovation</li>
          <li>Community Impact</li>
        </ul>
      </section>
    </div>
  </div>
);

export default About; 