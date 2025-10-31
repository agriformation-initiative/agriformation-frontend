'use client';
import React from 'react';
import Image from 'next/image';
import { Mail, Globe, Send, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const navigateTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-stone-50">
      {/* Hero Section */}
      <section className="lg:mt-0 mt-12 pt-20 pb-24 px-5 md:px-8 bg-gradient-to-br from-amber-50/40 via-stone-50 to-green-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/5 text-green-800 rounded text-sm font-medium border border-green-900/10">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                Get in Touch
              </div>
              <h1 className="text-[2.75rem] md:text-6xl font-bold text-stone-900 leading-[1.08] tracking-tight">
                Contact <span className="text-green-700 italic font-serif">Agriformation</span>
              </h1>
              <p className="text-[1.1rem] text-stone-600 leading-[1.7] font-light max-w-xl">
                We’d love to hear from you! Whether you’re interested in partnering, volunteering, or learning more about our initiatives, reach out to us today.
              </p>
              <button
                onClick={() => navigateTo('#contact-form')}
                className="px-6 py-3 bg-green-800 text-white rounded font-medium hover:bg-green-900 transition-colors inline-flex items-center gap-2 shadow-sm"
              >
                Send a Message <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-2xl shadow-stone-900/20 border border-stone-200">
                <Image
                  src="https://images.unsplash.com/photo-1722807797686-6d9e4041f534?w=600&h=750&fit=crop"
                  alt="Students engaging with agriculture"
                  width={600}
                  height={750}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 px-5 md:px-8 bg-white border-y border-stone-200" id="contact-info">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/5 text-green-800 rounded text-sm font-medium mb-6 border border-green-900/10">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
              Reach Out
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">
              Contact Information
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              Connect with us through our various channels to get involved or seek more details about our work.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Email Card */}
            <div className="p-8 bg-stone-50 border border-stone-200 rounded hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-green-800 text-white rounded mb-4">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Email</h3>
              <p className="text-stone-600">
                <a href="mailto:theagriformation.project@gmail.com" className="hover:text-green-700 transition-colors">
                  theagriformation.project@gmail.com
                </a>
              </p>
            </div>

            {/* Social Media Card */}
            <div className="p-8 bg-stone-50 border border-stone-200 rounded hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-green-800 text-white rounded mb-4">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Social Media</h3>
              <ul className="space-y-2 text-stone-600">
                <li>
                  <a href="https://www.linkedin.com/company/agriformation-initiative/" target="_blank" rel="noopener noreferrer" className="hover:text-green-700 transition-colors flex items-center gap-1">
                    LinkedIn <Send size={14} className="inline" />
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/profile.php?id=61560490960753" target="_blank" rel="noopener noreferrer" className="hover:text-green-700 transition-colors flex items-center gap-1">
                    Facebook <Send size={14} className="inline" />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/agriformation_initiative" target="_blank" rel="noopener noreferrer" className="hover:text-green-700 transition-colors flex items-center gap-1">
                    Instagram <Send size={14} className="inline" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 px-5 md:px-8 bg-stone-50" id="contact-form">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/5 text-green-800 rounded text-sm font-medium mb-6 border border-green-900/10">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
              Send a Message
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 leading-tight tracking-tight">
              Reach Out to Us
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Fill out the form below, and we’ll get back to you as soon as possible.
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-sm shadow-xl border border-stone-200">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-5 py-3 border border-stone-300 rounded focus:outline-none focus:border-green-700 transition-colors"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-5 py-3 border border-stone-300 rounded focus:outline-none focus:border-green-700 transition-colors"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-5 py-3 border border-stone-300 rounded focus:outline-none focus:border-green-700 transition-colors"
                required
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                className="w-full px-5 py-3 border border-stone-300 rounded focus:outline-none focus:border-green-700 transition-colors resize-none"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-green-800 text-white rounded font-medium hover:bg-green-900 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Send Message <Send size={18} strokeWidth={2.5} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section (Optional Match with Home) */}
      <section className="py-24 px-5 md:px-8 bg-green-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-8 relative">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            Ready to Make an Impact?
          </h2>
          <p className="text-lg text-green-50 leading-relaxed max-w-2xl mx-auto">
            Join us in reshaping agricultural education in Nigeria — one student, one school, one future at a time.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href='/volunteer'
              className="px-6 py-3 bg-white text-green-900 rounded font-medium hover:bg-green-50 transition-colors shadow-lg"
            >
              Volunteer With Us
            </Link>
            <Link href='#contact-form'
              className="px-6 py-3 bg-transparent text-white rounded font-medium border-2 border-white hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}