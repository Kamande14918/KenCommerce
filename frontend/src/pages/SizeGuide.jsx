import React from 'react';

const SizeGuide = () => (
  <div className="pt-24 min-h-screen bg-gray-50">
    <div className="container-custom py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Size Guide</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Clothing Size Chart</h2>
        <table className="w-full text-left border border-gray-200 mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Size</th>
              <th className="p-2">Bust (cm)</th>
              <th className="p-2">Waist (cm)</th>
              <th className="p-2">Hips (cm)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="p-2">S</td><td className="p-2">84-88</td><td className="p-2">66-70</td><td className="p-2">90-94</td></tr>
            <tr><td className="p-2">M</td><td className="p-2">88-92</td><td className="p-2">70-74</td><td className="p-2">94-98</td></tr>
            <tr><td className="p-2">L</td><td className="p-2">92-96</td><td className="p-2">74-78</td><td className="p-2">98-102</td></tr>
            <tr><td className="p-2">XL</td><td className="p-2">96-100</td><td className="p-2">78-82</td><td className="p-2">102-106</td></tr>
          </tbody>
        </table>
        <p className="text-gray-600">Tip: If you are between sizes, we recommend choosing the larger size for a more comfortable fit.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
        <p className="text-gray-700">Contact our support team for personalized sizing advice: <a href="mailto:support@kencommerce.com" className="text-primary-600 underline">support@kencommerce.com</a></p>
      </section>
    </div>
  </div>
);

export default SizeGuide; 