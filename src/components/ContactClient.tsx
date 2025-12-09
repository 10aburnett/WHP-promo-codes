'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactClient() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showMessage, setShowMessage] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setShowMessage(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus('error');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      question: t('contact.faq1Question'),
      answer: t('contact.faq1Answer')
    },
    {
      question: t('contact.faq2Question'),
      answer: t('contact.faq2Answer')
    },
    {
      question: t('contact.faq3Question'),
      answer: t('contact.faq3Answer')
    }
  ];

  return (
    <main className="min-h-screen py-16 transition-theme" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      <div className="mx-auto w-[90%] md:w-[95%] max-w-[1100px]">

        {/* Header */}
        <header className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-sm mb-6 hover:opacity-80 transition-opacity"
            style={{ color: 'var(--accent-color)' }}
          >
            <span aria-hidden="true">←</span>
            <span className="ml-2">{t('contact.backToHome')}</span>
          </Link>

          <h1 className="text-3xl md:text-4xl font-semibold mb-3" style={{ color: 'var(--text-color)' }}>
            {t('contact.title')}
          </h1>
          <p className="text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            {t('contact.subtitle')}
          </p>
          <div className="w-16 h-px mt-6" style={{ backgroundColor: 'var(--border-color)' }} />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">

          {/* LEFT: Contact Form */}
          <div
            className="p-8"
            style={{ backgroundColor: 'var(--background-secondary)' }}
          >
            <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-color)' }}>
              {t('contact.sendMessage')}
            </h2>

            {/* Toast Message */}
            {showMessage && (
              <div
                className={`mb-6 py-3 px-4 border-l-2 transition-all duration-300 ${showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
                style={{
                  borderLeftColor: submitStatus === 'success' ? 'var(--accent-color)' : '#ef4444',
                  backgroundColor: submitStatus === 'success' ? 'rgba(22, 101, 52, 0.05)' : 'rgba(239, 68, 68, 0.05)'
                }}
              >
                <p className="text-sm" style={{ color: submitStatus === 'success' ? 'var(--accent-color)' : '#ef4444' }}>
                  {submitStatus === 'success' ? t('contact.successMessage') : t('contact.errorMessage')}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-opacity-50 px-4 py-3 text-base focus:outline-none transition-all duration-200"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--background-color)'
                  }}
                  placeholder=" "
                />
                <label
                  htmlFor="name"
                  className="absolute left-3 -top-2 px-1 text-xs"
                  style={{ color: 'var(--text-muted)', backgroundColor: 'var(--background-color)' }}
                >
                  {t('contact.name')}
                </label>
              </div>

              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-opacity-50 px-4 py-3 text-base focus:outline-none transition-all duration-200"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--background-color)'
                  }}
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="absolute left-3 -top-2 px-1 text-xs"
                  style={{ color: 'var(--text-muted)', backgroundColor: 'var(--background-color)' }}
                >
                  {t('contact.email')}
                </label>
              </div>

              {/* Subject Field */}
              <div className="relative">
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-opacity-50 px-4 py-3 text-base focus:outline-none transition-all duration-200"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--background-color)'
                  }}
                  placeholder=" "
                />
                <label
                  htmlFor="subject"
                  className="absolute left-3 -top-2 px-1 text-xs"
                  style={{ color: 'var(--text-muted)', backgroundColor: 'var(--background-color)' }}
                >
                  {t('contact.subject')}
                </label>
              </div>

              {/* Message Field */}
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-transparent border border-opacity-50 px-4 py-3 text-base focus:outline-none transition-all duration-200 resize-none"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-color)',
                    backgroundColor: 'var(--background-color)'
                  }}
                  placeholder=" "
                />
                <label
                  htmlFor="message"
                  className="absolute left-3 -top-2 px-1 text-xs"
                  style={{ color: 'var(--text-muted)', backgroundColor: 'var(--background-color)' }}
                >
                  {t('contact.message')}
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 font-medium text-base transition-all duration-200 disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--accent-color)',
                  color: 'white'
                }}
              >
                {isSubmitting ? t('common.loading') : t('contact.send')}
              </button>
            </form>
          </div>

          {/* RIGHT: Contact Info + FAQ */}
          <aside className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-color)' }}>
                {t('contact.getInTouch')}
              </h2>

              <div className="space-y-5">
                {/* Email Support */}
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(22, 101, 52, 0.06)' }}
                  >
                    <svg className="w-5 h-5" style={{ color: 'var(--accent-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-color)' }}>
                      {t('contact.emailSupport')}
                    </h3>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {t('contact.emailSupportDesc')}
                    </p>
                    <a
                      href="mailto:digitalpromocodescontact@gmail.com"
                      className="text-sm hover:opacity-80 transition-opacity"
                      style={{ color: 'var(--accent-color)' }}
                    >
                      digitalpromocodescontact@gmail.com
                    </a>
                  </div>
                </div>

                {/* Business Inquiries */}
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(22, 101, 52, 0.06)' }}
                  >
                    <svg className="w-5 h-5" style={{ color: 'var(--accent-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-color)' }}>
                      {t('contact.businessInquiries')}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {t('contact.businessInquiriesDesc')}
                    </p>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(22, 101, 52, 0.06)' }}
                  >
                    <svg className="w-5 h-5" style={{ color: 'var(--accent-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-color)' }}>
                      {t('contact.responseTime')}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {t('contact.responseTimeDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Collapsible */}
            <div className="pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-color)' }}>
                {t('contact.faqTitle')}
              </h3>

              <div className="space-y-0">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border-b"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full py-3 flex items-center justify-between text-left"
                    >
                      <span className="text-sm font-medium pr-4" style={{ color: 'var(--text-color)' }}>
                        {faq.question}
                      </span>
                      <svg
                        className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`}
                        style={{ color: 'var(--text-muted)' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-200 ${openFaq === index ? 'max-h-32 pb-3' : 'max-h-0'}`}
                    >
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

      </div>
    </main>
  );
}
