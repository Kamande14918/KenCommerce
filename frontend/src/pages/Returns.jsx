import React from 'react';

const Returns = () => (
  <div className="pt-24 min-h-screen bg-gray-50">
    <div className="container-custom py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Returns & Exchanges</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Our Return Policy</h2>
        <p className="text-gray-700 mb-2">We want you to be completely satisfied with your purchase. If you are not satisfied, you may return most new, unopened items within 7 days of delivery for a full refund or exchange.</p>
        <ul className="list-disc ml-6 text-gray-600">
          <li>Items must be returned in their original condition and packaging.</li>
          <li>Some items (e.g., perishable goods, personal care) may not be eligible for return.</li>
          <li>Return shipping costs are the responsibility of the customer unless the return is due to our error.</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">How to Request a Return</h2>
        <ol className="list-decimal ml-6 text-gray-600">
          <li>Contact our support team at <a href="mailto:support@kencommerce.com" className="text-primary-600 underline">support@kencommerce.com</a> or call +254 111 416 178.</li>
          <li>Provide your order number, the item(s) you wish to return, and the reason for return.</li>
          <li>We will provide you with return instructions and a return authorization if eligible.</li>
        </ol>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
        <p className="text-gray-700">If you have any questions about our return policy, please contact us at <a href="mailto:support@kencommerce.com" className="text-primary-600 underline">support@kencommerce.com</a> or call +254 111 416 178.</p>
      </section>
    </div>
  </div>
);

export default Returns; 