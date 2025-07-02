import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or email service
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="container-custom py-8 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <p className="text-gray-600 mb-6">Have a question or need help? Fill out the form below or reach us at <a href="mailto:support@kencommerce.com" className="text-primary-600 underline">support@kencommerce.com</a> or +254 111 416 178.</p>
        {submitted ? (
          <div className="bg-green-100 text-green-700 p-4 rounded mb-6">Thank you for contacting us! We'll get back to you soon.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Your Name" className="input w-full" />
            <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="Your Email" className="input w-full" />
            <textarea name="message" value={form.message} onChange={handleChange} required placeholder="Your Message" className="input w-full min-h-[120px]" />
            <button type="submit" className="btn-primary w-full">Send Message</button>
          </form>
        )}
        <div className="mt-8 text-gray-700">
          <h2 className="font-semibold mb-2">Our Office</h2>
          <p>Nairobi, Kenya</p>
          <p>support@kencommerce.com</p>
          <p>+254 111 416 178</p>
        </div>
      </div>
    </div>
  );
};

export default Contact; 